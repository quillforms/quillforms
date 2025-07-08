/**
 * QuillForms Dependencies
 */
import { useMessages, HTMLParser, useBlockTheme, useFormContext } from '@quillforms/renderer-core';
import ConfigAPI from '@quillforms/config';



/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import tinyColor from 'tinycolor2';

const Display = (props) => {
	const {
		id,
		attributes,
		setIsValid,
		setIsAnswered,
		setValidationErr,
		showNextBtn,
		blockWithError,
		next,
		val,
		setVal,
		showErrMsg,
		inputRef,
		isTouchScreen,
		isPreview, // => if true i in build mode not render the block mode
	} = props;

	const {
		required,
		eventId,
		username,
		email,
		scheduleText,
		alreadyScheduledText,
	} = attributes;

	const messages = useMessages();
	const { editor } = useFormContext();
	const [prefill, setPrefill] = useState({});
	const [iframeUrl, setIframeUrl] = useState('');
	const [eventUrl, setEventUrl] = useState('');
	const [showConfirmationOverlay, setShowConfirmationOverlay] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [pluginStatus, setPluginStatus] = useState('checking'); // 'checking', 'active', 'inactive', 'not_installed', 'no_permission', 'no_events'
	const [isLoadingEvent, setIsLoadingEvent] = useState(false);
	const [loadingMessage, setLoadingMessage] = useState('');
	const theme = useBlockTheme(attributes.themeId);
	const answersColor = tinyColor(theme.answersColor);

	// Use useSelect to get field values directly from the store
	const { parsedUsername, parsedEmail } = useSelect((select) => {
		const getFieldVal = select('quillForms/renderer-core').getFieldAnswerVal;

		let usernameValue = null;
		let emailValue = null;

		try {
			if (username?.value && typeof username.value === 'string') {
				usernameValue = getFieldVal(username.value);
				// Convert to string if it's not already
				usernameValue = usernameValue ? String(usernameValue) : null;
			}
		} catch (error) {
			usernameValue = null;
		}

		try {
			if (email?.value && typeof email.value === 'string') {
				emailValue = getFieldVal(email.value);
				// Convert to string if it's not already
				emailValue = emailValue ? String(emailValue) : null;
			}
		} catch (error) {
			emailValue = null;
		}

		return {
			parsedUsername: usernameValue,
			parsedEmail: emailValue,
		};
	}, [username?.value, email?.value]);

	const checkFieldValidation = (value) => {
		// If QuillBooking plugin is not active or still checking, skip required validation (make field optional)
		if (pluginStatus !== 'active') {
			setIsValid(true);
			setValidationErr(null);
			return;
		}

		if (required === true && !value) {
			setIsValid(false);
			setValidationErr(messages['label.errorAlert.required']);
		} else {
			setIsValid(true);
			setValidationErr(null);
		}
	};

	// Enhanced postMessage listener for booking confirmation
	useEffect(() => {
		const handlePostMessage = (event) => {
			try {
				let data = event.data;
				if (typeof data === 'string') {
					data = JSON.parse(data);
				}

				if (data && data.blockId === id && data.type === 'quillbooking_confirmation') {
					const bookingValue = {
						eventId: data.eventId,
						bookingId: data.bookingId,
						status: 'confirmed',
						bookingDate: data.bookingDate,
						bookingTime: data.bookingTime,
						bookingData: data.bookingData
					};

					setVal(bookingValue);
					showErrMsg(false);
					checkFieldValidation(bookingValue);

					// Show confirmation overlay
					setShowConfirmationOverlay(true);

					if (bookingValue) {
						// Close modal if open
						setModalOpen(false);

						// Hide overlay after 3 seconds
						setTimeout(() => {
							setShowConfirmationOverlay(false);
						}, 3000);

						setTimeout(() => {
							next();
						}, 2000);
						setIsAnswered(true);
						showNextBtn(true);
					}
				}
			} catch (error) {
				// Ignore non-JSON messages
			}
		};

		window.addEventListener('message', handlePostMessage);
		return () => window.removeEventListener('message', handlePostMessage);
	}, [id]);

	useEffect(() => {
		checkFieldValidation(val);

		// Add the has-booking-block class to ensure proper styling
		const formContainer = document.querySelector('.quillforms-renderer-container');
		if (formContainer && !formContainer.classList.contains('has-booking-block')) {
			formContainer.classList.add('has-booking-block');
		}
	}, [attributes, val]);

	// Update prefill data when field values change
	useEffect(() => {
		const newPrefill = { ...prefill };
		let hasChanges = false;

		if (parsedUsername && prefill.username !== parsedUsername) {
			newPrefill.username = parsedUsername;
			hasChanges = true;
		}

		if (parsedEmail && prefill.email !== parsedEmail) {
			newPrefill.email = parsedEmail;
			hasChanges = true;
		}

		if (hasChanges) {
			setPrefill(newPrefill);
		}
	}, [parsedUsername, parsedEmail]);

	// Check if QuillBooking plugin is active
	useEffect(() => {
		const checkPluginStatus = async () => {
			setLoadingMessage('Checking QuillBooking plugin...');

			try {
				// Add a minimum delay to show the loading state
				await new Promise(resolve => setTimeout(resolve, 800));

				// Method 1: Check using WordPress plugins API
				try {
					setLoadingMessage('Verifying plugin installation...');
					await new Promise(resolve => setTimeout(resolve, 500));

					const response = await apiFetch({
						path: 'wp/v2/plugins',
					});

					// Look for QuillBooking plugin in the installed plugins
					const quillBookingPlugin = response.find(plugin =>
						plugin.plugin && (
							plugin.plugin.includes('quillbooking') ||
							plugin.name.toLowerCase().includes('quillbooking')
						)
					);

					if (!quillBookingPlugin) {
						setLoadingMessage('Plugin not found...');
						await new Promise(resolve => setTimeout(resolve, 500));
						setPluginStatus('not_installed');
						return;
					}

					if (quillBookingPlugin.status !== 'active') {
						setLoadingMessage('Plugin not active...');
						await new Promise(resolve => setTimeout(resolve, 500));
						setPluginStatus('inactive');
						return;
					}

					// Plugin is active, now check if it has events
					try {
						setLoadingMessage('Checking for events...');
						await new Promise(resolve => setTimeout(resolve, 500));

						const events = await apiFetch({
							path: 'qb/v1/events?per_page=1',
						});

						const eventData = events.data;

						if (eventData && Array.isArray(eventData) && eventData.length > 0) {
							setLoadingMessage('Plugin ready!');
							await new Promise(resolve => setTimeout(resolve, 300));
							setPluginStatus('active');
						} else {
							setLoadingMessage('No events found...');
							await new Promise(resolve => setTimeout(resolve, 500));
							setPluginStatus('no_events');
						}
					} catch (eventsError) {
						// Plugin is active but no events available
						console.log('eventsError', eventsError);
						setLoadingMessage('Events not accessible...');
						await new Promise(resolve => setTimeout(resolve, 500));
						setPluginStatus('no_events');
					}

				} catch (pluginsError) {
					// Method 2: Fallback - Check if QuillBooking endpoints exist directly
					try {
						setLoadingMessage('Trying alternative check...');
						await new Promise(resolve => setTimeout(resolve, 500));

						await apiFetch({
							path: 'qb/v1/events?per_page=1',
						});
						setLoadingMessage('Plugin ready!');
						await new Promise(resolve => setTimeout(resolve, 300));
						setPluginStatus('active');
					} catch (fallbackError) {

						if (fallbackError.code === 'rest_no_route') {
							setLoadingMessage('Plugin not installed...');
							await new Promise(resolve => setTimeout(resolve, 500));
							setPluginStatus('not_installed');
						} else if (fallbackError.code === 'rest_forbidden' || fallbackError.code === 'rest_cannot_access') {
							setLoadingMessage('Permission denied...');
							await new Promise(resolve => setTimeout(resolve, 500));
							setPluginStatus('no_permission');
						} else {
							setLoadingMessage('Plugin inactive...');
							await new Promise(resolve => setTimeout(resolve, 500));
							setPluginStatus('inactive');
						}
					}
				}

			} catch (error) {
				setLoadingMessage('Error occurred...');
				await new Promise(resolve => setTimeout(resolve, 500));
				setPluginStatus('inactive');
			} finally {
				setLoadingMessage('');
			}
		};

		checkPluginStatus();
	}, []);

	// Generate event URL based on eventId
	useEffect(() => {
		const generateEventUrl = async () => {
			if (eventId && pluginStatus === 'active') {
				setIsLoadingEvent(true);
				setLoadingMessage('Loading event details...');

				try {
					// Add a delay to show loading state
					await new Promise(resolve => setTimeout(resolve, 600));

					// Try to fetch event details to construct proper URL using apiFetch
					const event = await apiFetch({
						path: `qb/v1/events/${eventId}`,
					});

					if (event && event.calendar && event.slug) {
						setLoadingMessage('Generating booking URL...');
						await new Promise(resolve => setTimeout(resolve, 400));

						// Get calendar slug and event slug for proper QuillBooking URL
						const calendarSlug = event.calendar.slug || event.calendar.name;
						const eventSlug = event.slug;

						// QuillBooking URL format: site_url?quillbooking_calendar=calendar_slug&event=event_slug
						// Get site URL by removing /wp-admin/ from admin URL
						const adminUrl = ConfigAPI.getAdminUrl();
						const baseUrl = adminUrl.replace(/\/wp-admin\/$/, '');
						const generatedUrl = `${baseUrl}?quillbooking_calendar=${encodeURIComponent(calendarSlug)}&event=${encodeURIComponent(eventSlug)}`;

						setLoadingMessage('Event ready!');
						await new Promise(resolve => setTimeout(resolve, 300));
						setEventUrl(generatedUrl);
						return;
					}
				} catch (error) {
					setLoadingMessage('Event not found...');
					await new Promise(resolve => setTimeout(resolve, 500));
					// Event not found or other error, eventUrl will remain empty
				} finally {
					setIsLoadingEvent(false);
					setLoadingMessage('');
				}
			}
		};

		generateEventUrl();
	}, [eventId, pluginStatus]);

	// Prepare iframe URL with parameters
	useEffect(() => {
		if (eventUrl) {
			try {
				const url = new URL(eventUrl);
				if (prefill.username) url.searchParams.set('username', prefill.username);
				if (prefill.email) url.searchParams.set('email', prefill.email);
				url.searchParams.set('blockId', id);
				// Tell QuillBooking we're in inline embed mode
				url.searchParams.set('embed_type', 'Inline');
				setIframeUrl(url.toString());
			} catch (error) {
				// If URL is invalid, add parameters manually
				const separator = eventUrl.includes('?') ? '&' : '?';
				const params = new URLSearchParams();
				if (prefill.username) params.set('username', prefill.username);
				if (prefill.email) params.set('email', prefill.email);
				params.set('blockId', id);
				params.set('embed_type', 'Inline');
				setIframeUrl(eventUrl + separator + params.toString());
			}
		}
	}, [eventUrl, prefill, id]);

	// Handle booking button click (for mobile popup)
	const handleBookingClick = () => {
		setModalOpen(true);
	};

	// Construct URL based on booking status
	const url = val && val.status === 'confirmed'
		? `${eventUrl}?quillbooking=booking&id=${val.bookingId}&type=confirm&embed_type=Inline`
		: iframeUrl || eventUrl;


	// Show different messages based on plugin status and URL availability
	if (pluginStatus === 'checking' || isLoadingEvent || loadingMessage) {
		if (editor.mode === 'on' || isPreview) {
			// Build mode - show detailed status
			return (
				<div className="quill-booking-container" style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: '#f8f9fa',
					border: '2px dashed #dee2e6',
					borderRadius: '8px',
					color: '#6c757d',
					textAlign: 'center',
					padding: '20px'
				}}>
					<div>
						<div style={{
							marginBottom: '16px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
							<div className={css`
								border: 3px solid #f3f3f3;
								border-top: 3px solid ${theme.questionsColor};
								border-radius: 50%;
								width: 30px;
								height: 30px;
								animation: spin 1s linear infinite;
								margin-right: 12px;
								
								@keyframes spin {
									0% { transform: rotate(0deg); }
									100% { transform: rotate(360deg); }
								}
							`} />
							<h3 style={{ margin: 0, color: '#495057' }}>
								{loadingMessage || 'Checking QuillBooking plugin...'}
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
							Please wait while we verify the booking system...
						</p>
					</div>
				</div>
			);
		} else {
			// End-user mode - show simple loading
			return (
				<div className="quill-booking-container" style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: '#f8f9fa',
					border: '2px dashed #dee2e6',
					borderRadius: '8px',
					color: '#6c757d',
					textAlign: 'center',
					padding: '20px'
				}}>
					<div>
						<div style={{
							marginBottom: '16px',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
							<div className={css`
								border: 3px solid #f3f3f3;
								border-top: 3px solid ${theme.questionsColor};
								border-radius: 50%;
								width: 30px;
								height: 30px;
								animation: spin 1s linear infinite;
								margin-right: 12px;
								
								@keyframes spin {
									0% { transform: rotate(0deg); }
									100% { transform: rotate(360deg); }
								}
							`} />
							<h3 style={{ margin: 0, color: '#495057' }}>
								Loading...
							</h3>
						</div>
						<p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
							Please wait while the booking system loads...
						</p>
					</div>
				</div>
			);
		}
	}

	if (pluginStatus !== 'active' && pluginStatus !== 'checking') {
		if (editor.mode === 'on' || isPreview) {
			// Build mode - show detailed plugin status and admin actions
			let title = 'QuillBooking Plugin Required';
			let message = 'The QuillBooking plugin is not installed or not active';
			let actionText = 'Go to Plugins';
			let actionUrl = `${ConfigAPI.getAdminUrl()}plugins.php`;
			let backgroundColor = '#fff3cd';
			let borderColor = '#ffc107';
			let textColor = '#856404';

			if (pluginStatus === 'not_installed') {
				title = 'QuillBooking Plugin Not Installed';
				message = 'The QuillBooking plugin needs to be installed to display booking forms';
				actionText = 'Install QuillBooking Plugin';
				actionUrl = `${ConfigAPI.getAdminUrl()}plugin-install.php?s=quillbooking&tab=search&type=term`;
				backgroundColor = '#f8d7da';
				borderColor = '#dc3545';
				textColor = '#721c24';
			} else if (pluginStatus === 'no_permission') {
				title = 'Permission Required';
				message = 'You do not have permission to access the QuillBooking API';
				actionText = 'Check Permissions';
				actionUrl = `${ConfigAPI.getAdminUrl()}users.php`;
				backgroundColor = '#d1ecf1';
				borderColor = '#17a2b8';
				textColor = '#0c5460';
			} else if (pluginStatus === 'no_events') {
				title = 'No Calendars or Events Found';
				message = 'QuillBooking is installed but no calendars or events are available';
				actionText = 'Create Calendar and Event';
				actionUrl = `${ConfigAPI.getAdminUrl()}admin.php?page=quillbooking&path=calendars`;
				backgroundColor = '#d4edda';
				borderColor = '#28a745';
				textColor = '#155724';
			}

			return (
				<div className="quill-booking-container" style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: backgroundColor,
					border: `2px dashed ${borderColor}`,
					borderRadius: '8px',
					color: textColor,
					textAlign: 'center',
					padding: '20px',
					pointerEvents: 'all'
				}}>
					<div>
						<h3 style={{ margin: '0 0 10px 0', color: textColor }}>{title}</h3>
						<p style={{ margin: '0 0 15px 0' }}>{message}</p>
						<a
							href={actionUrl}
							target="_blank"
							style={{
								color: '#007cba',
								textDecoration: 'underline',
								fontWeight: '500'
							}}
							onClick={(e) => {
								e.preventDefault();
								window.open(actionUrl, '_blank');
							}}
						>
							{actionText}
						</a>
					</div>
				</div>
			);
		} else {
			// End-user mode - show simple contact admin message
			return (
				<div className="quill-booking-container" style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: '#f8d7da',
					border: '2px dashed #dc3545',
					borderRadius: '8px',
					color: '#721c24',
					textAlign: 'center',
					padding: '20px'
				}}>
					<div>
						<h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Booking Unavailable</h3>
						<p style={{ margin: '0' }}>This booking form is currently unavailable. Please contact the administrator for assistance.</p>
					</div>
				</div>
			);
		}
	}

	// Show fallback content if no URL is provided but plugin is active
	if (!url || !eventUrl) {
		if (editor.mode === 'on' || isPreview) {
			// Build mode - show detailed event status and admin actions
			return (
				<div className="quill-booking-container" style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: '#d4edda',
					border: '2px dashed #28a745',
					borderRadius: '8px',
					color: '#155724',
					textAlign: 'center',
					padding: '20px'
				}}>
					<div>
						<h3 style={{ margin: '0 0 10px 0', color: '#155724' }}>Event Not Found</h3>
						<p style={{ margin: '0 0 15px 0' }}>The selected event could not be found or may have been deleted</p>
						<a
							href={`${ConfigAPI.getAdminUrl()}admin.php?page=quillbooking&path=calendars`}
							target="_blank"
							style={{
								color: '#007cba',
								textDecoration: 'underline',
								fontWeight: '500'
							}}
							onClick={(e) => {
								e.preventDefault();
								window.open(`${ConfigAPI.getAdminUrl()}admin.php?page=quillbooking&path=calendars`, '_blank');
							}}
						>
							Create Calendar and Event
						</a>
					</div>
				</div>
			);
		} else {
			// End-user mode - show simple contact admin message
			return (
				<div className="quill-booking-container" style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					height: '100%',
					width: '100%',
					backgroundColor: '#f8d7da',
					border: '2px dashed #dc3545',
					borderRadius: '8px',
					color: '#721c24',
					textAlign: 'center',
					padding: '20px'
				}}>
					<div>
						<h3 style={{ margin: '0 0 10px 0', color: '#721c24' }}>Booking Unavailable</h3>
						<p style={{ margin: '0' }}>This booking form is currently unavailable. Please contact the administrator for assistance.</p>
					</div>
				</div>
			);
		}
	}

	return (
		<div className={classnames('quill-booking-container', css`
			.quill-booking-spinner>div {
				background-color: ${theme.questionsColor};
			}
			
			.quill-booking-confirmation-overlay {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				background: rgba(255, 255, 255, 0.95);
				display: flex;
				align-items: center;
				justify-content: center;
				z-index: 10;
				opacity: 0;
				animation: fadeIn 0.5s ease-in forwards;
			}
			
			@keyframes fadeIn {
				to { opacity: 1; }
			}
		`)}>
			<div className="quill-booking-inline-widget-wrapper">
				<iframe
					src={url}
					frameBorder="0"
					allowFullScreen
					loading="lazy"
					title={val && val.status === 'confirmed' ? "Booking Confirmation" : "Booking Form"}
					style={{
						width: '100%',
						height: '100%',
						border: 'none',
						margin: 0,
						padding: 0,
						display: 'block',
					}}
				/>
			</div>
			<div className="quill-booking-popup-button-wrapper">
				{val ? (
					<div
						className={css`
							font-size: ${theme.fontSize.sm} !important;
							line-height: ${theme.fontLineHeight.sm} !important;
							color: ${theme.answersColor};
							text-align: center;
							padding: 15px;
							background: #d4edda;
							border: 1px solid #c3e6cb;
							border-radius: 8px;
							margin: 10px;
						`}
					>
						{alreadyScheduledText || '✅ Booking Confirmed!'}
					</div>
				) : (
					<button
						className={css`
							background: ${answersColor.setAlpha(0.3).toString()};
							color: ${theme.answersColor};
							border: 1px solid ${theme.answersColor};
							cursor: pointer;
							padding: 10px 20px;
							border-radius: 5px;
							box-shadow: none;
						`}
						onClick={handleBookingClick}
					>
						{scheduleText}
					</button>
				)}
			</div>

			{/* Modal for mobile */}
			{modalOpen && (
				<div className={css`
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.5);
					z-index: 10000;
					display: flex;
					align-items: center;
					justify-content: center;
					padding: 20px;
				`}>
					<div className={css`
						background: white;
						border-radius: 8px;
						width: 100%;
						max-width: 800px;
						height: 90%;
						position: relative;
						overflow: hidden;
					`}>
						<button
							className={css`
								position: absolute;
								top: 10px;
								right: 10px;
								background: rgba(0, 0, 0, 0.1);
								border: none;
								border-radius: 50%;
								width: 40px;
								height: 40px;
								cursor: pointer;
								z-index: 10001;
								font-size: 18px;
								display: flex;
								align-items: center;
								justify-content: center;
								&:hover {
									background: rgba(0, 0, 0, 0.2);
								}
							`}
							onClick={() => setModalOpen(false)}
						>
							×
						</button>
						<iframe
							src={url}
							frameBorder="0"
							allowFullScreen
							loading="lazy"
							title="Booking Form"
							style={{
								width: '100%',
								height: '100%',
								border: 'none',
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default Display;

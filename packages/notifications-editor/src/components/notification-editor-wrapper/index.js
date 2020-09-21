/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
	TextControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import uniq from 'lodash/uniq';
import CloseIcon from '@material-ui/icons/Close';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import EmailInserter from '../email-inserter';
import ReplyTo from '../reply-to';
import EmailMessage from '../email-message';
import EmailSubject from '../email-subject';
import NotificationEditor from '../notification-editor';
import NotificationEditorFooter from '../notification-editor-footer';

const NotificationEditorWrapper = ( {
	sliderRef,
	currentNotificationProperties,
	notificationId,
	activeSlide,
} ) => {
	const [ properties, setProperties ] = useState( {
		...currentNotificationProperties,
	} );

	useEffect( () => {
		if ( currentNotificationProperties ) {
			setProperties( currentNotificationProperties );
		}
	}, [ currentNotificationProperties ] );

	const { active, title, recipients, replyTo, subject, message } = properties;

	const { emailFields } = useSelect( ( select ) => {
		return {
			emailFields: select( 'quillForms/block-editor' )
				.getFormStructure()
				.filter( ( field ) => field.type === 'email' ),
		};
	} );

	return (
		<div className="notifications-editor-notification-editor-wrapper">
			<h4
				className={ css`
					font-size: 14px;
					display: inline-block;
					padding-bottom: 10px;
					border-bottom: 1px solid;
				` }
			>
				{ notificationId
					? 'Edit Notification'
					: 'Create a new notification' }{ ' ' }
			</h4>
			<__experimentalBaseControl>
				<__experimentalControlWrapper>
					<__experimentalControlLabel label="Title" />
					<TextControl
						value={ title }
						setValue={ ( val ) => {
							setProperties( {
								...properties,
								title: val,
							} );
						} }
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper>
					<__experimentalControlLabel label="Active" />
					<ToggleControl
						checked={ active }
						onChange={ () => {
							setProperties( {
								...properties,
								active: ! active,
							} );
						} }
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="vertical">
					<__experimentalControlLabel label="Send a notification to" />
					<div className="email__inserterWrapper">
						{ recipients && recipients.length > 0 && (
							<div className="recipients__list">
								{ recipients.map( ( recipient ) => {
									return (
										<span
											className="receipient__emailWrapper"
											key={ recipient }
										>
											<span className="receipient__email">
												{ recipient }
											</span>
											<span className="email__delete">
												<CloseIcon
													onClick={ () => {
														const newRecipients = [
															...recipients,
														];

														const index = newRecipients.indexOf(
															recipient
														);
														if ( index > -1 ) {
															newRecipients.splice(
																index,
																1
															);
														}
														setProperties( {
															...properties,
															recipients: uniq(
																newRecipients
															),
														} );
													} }
												/>
											</span>
										</span>
									);
								} ) }
							</div>
						) }
						<EmailInserter
							addEmail={ ( email ) => {
								const newRecipients = [ ...recipients ];
								newRecipients.push( email );
								setProperties( {
									...properties,
									recipients: uniq( newRecipients ),
								} );
							} }
						/>
					</div>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<ReplyTo
				emailFields={ emailFields }
				value={ replyTo }
				setValue={ ( val ) =>
					setProperties( {
						...properties,
						replyTo: val,
					} )
				}
			/>
			<EmailSubject
				value={ subject }
				setValue={ ( val ) =>
					setProperties( { ...properties, subject: val } )
				}
			/>
			<EmailMessage
				value={ message }
				setValue={ ( val ) =>
					setProperties( { ...properties, message: val } )
				}
			/>
			<NotificationEditor.Slot
				notificationProperties={ { ...properties } }
				setNotificationProperties={ ( value ) => {
					setProperties( {
						...properties,
						...value,
					} );
				} }
			/>
			{ activeSlide && (
				<NotificationEditorFooter
					sliderRef={ sliderRef }
					notificationId={ notificationId }
					properties={ properties }
				/>
			) }
		</div>
	);
};

export default NotificationEditorWrapper;

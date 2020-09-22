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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

/**
 * Internal Dependencies
 */
import EmailInserter from '../email-inserter';
import EmailSelect from '../email-select';
import EmailMessage from '../email-message';
import EmailSubject from '../email-subject';
import NotificationEditor from '../notification-editor';
import NotificationEditorFooter from '../notification-editor-footer';
import { cloneDeep } from 'lodash';

const NotificationEditorWrapper = ( {
	goBack,
	currentNotificationProperties,
	notificationId,
	activeSlide,
} ) => {
	const [ properties, setProperties ] = useState( {
		...currentNotificationProperties,
	} );

	useEffect( () => {
		if ( currentNotificationProperties ) {
			setProperties( { ...currentNotificationProperties } );
		}
	}, [ currentNotificationProperties ] );

	const {
		active,
		title,
		toType,
		recipients,
		replyTo,
		subject,
		message,
	} = cloneDeep( properties );

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
					: 'Create a new notification' }
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
					<div className="notification-editor-toType-select select-control-wrapper">
						<Select
							value={ toType }
							onChange={ ( e ) =>
								setProperties( {
									...properties,
									toType: e.target.value,
								} )
							}
						>
							<MenuItem value={ 'email' }>Enter email</MenuItem>
							<MenuItem value={ 'field' }>Select field</MenuItem>
						</Select>
					</div>
					{ toType === 'email' && (
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
								activeSlide={ activeSlide }
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
					) }
					{ toType === 'field' && (
						<EmailSelect
							isRequired={ true }
							emailFields={ emailFields }
							value={ replyTo }
							setValue={ ( val ) => {
								setProperties( {
									...properties,
									replyTo: val,
								} );
							} }
						/>
					) }
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<EmailSelect
				label="Reply to"
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
				setValue={ ( val ) => {
					setProperties( { ...properties, subject: val } );
				} }
			/>
			<EmailMessage
				value={ message }
				setValue={ ( val ) => {
					setProperties( { ...properties, message: val } );
				} }
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
					goBack={ goBack }
					notificationId={ notificationId }
					properties={ { ...properties } }
				/>
			) }
		</div>
	);
};

export default NotificationEditorWrapper;

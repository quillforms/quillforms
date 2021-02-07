/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { keys, zipObject } from 'lodash';

/**
 * Internal Dependencies
 */
import EmailSelect from '../email-select';
import NotificationMessage from '../notification-message';
import NotificationSubject from '../notification-subject';
import NotificationEditorFooter from '../notification-editor-footer';
import NotificationTitle from '../notification-title';
import NotificationTo from '../notification-to';

const NotificationEditorWrapper = ( {
	goBack,
	currentNotificationProperties,
	notificationId,
	activeSlide,
} ) => {
	const [ properties, setProperties ] = useState( {
		...currentNotificationProperties,
	} );

	const [ isReviewing, setIsReviewing ] = useState( false );

	const [ validationFlags, setValidationFlags ] = useState(
		zipObject(
			keys( { ...properties } ),
			keys( { ...properties } ).map( () => true )
		)
	);

	useEffect( () => {
		if ( currentNotificationProperties ) {
			setProperties( { ...currentNotificationProperties } );
		}
		setIsReviewing( false );
	}, [ activeSlide ] );

	const {
		active,
		title,
		toType,
		recipients,
		replyTo,
		subject,
		message,
	} = properties;

	const { emailFields } = useSelect( ( select ) => {
		return {
			emailFields: select( 'quillForms/block-editor' )
				.getBlocks()
				.filter( ( field ) => field.type === 'email' ),
		};
	} );

	return (
		<div className="notifications-editor-notification-editor-wrapper">
			{ activeSlide && (
				<>
					<h4 className="notifications-editor-notification-editor-wrapper__heading">
						{ notificationId
							? 'Edit Notification'
							: 'Create a new notification' }
					</h4>
					<NotificationTitle
						value={ title }
						setValue={ ( value ) => {
							setProperties( ( prevProperties ) => ( {
								...prevProperties,
								...value,
							} ) );
						} }
					/>
					<__experimentalBaseControl>
						<__experimentalControlWrapper>
							<__experimentalControlLabel label="Active" />
							<ToggleControl
								checked={ active }
								onChange={ () => {
									setProperties( ( prevProperties ) => ( {
										...prevProperties,
										active: ! active,
									} ) );
								} }
							/>
						</__experimentalControlWrapper>
					</__experimentalBaseControl>
					<NotificationTo
						emailFields={ emailFields }
						recipients={ recipients }
						toType={ toType }
						isValid={ { ...validationFlags }.recipients }
						setIsValid={ ( value ) => {
							setValidationFlags( ( prevFlags ) => ( {
								...prevFlags,
								recipients: value,
							} ) );
						} }
						setValue={ ( value ) => {
							setProperties( ( prevProperties ) => ( {
								...prevProperties,
								...value,
							} ) );
						} }
						isReviewing={ isReviewing }
					/>
					<__experimentalBaseControl>
						<EmailSelect
							label="Reply to"
							emailFields={ emailFields }
							value={ replyTo }
							setValue={ ( val ) =>
								setProperties( ( prevProperties ) => ( {
									...prevProperties,
									replyTo: val,
								} ) )
							}
						/>
					</__experimentalBaseControl>
					<NotificationSubject
						value={ subject }
						setValue={ ( val ) => {
							setProperties( ( prevProperties ) => ( {
								...prevProperties,
								subject: val,
							} ) );
						} }
						isValid={ { ...validationFlags }.subject }
						setIsValid={ ( val ) => {
							setValidationFlags( ( prevValidationFlags ) => ( {
								...prevValidationFlags,
								subject: val,
							} ) );
						} }
						isReviewing={ isReviewing }
					/>
					<NotificationMessage
						value={ message }
						setValue={ ( val ) => {
							setProperties( ( prevProperties ) => ( {
								...prevProperties,
								message: val,
							} ) );
						} }
						isValid={ { ...validationFlags }.message }
						setIsValid={ ( value ) => {
							setValidationFlags( ( prevFlags ) => {
								const $flags = { ...prevFlags, message: value };
								return $flags;
							} );
						} }
						isReviewing={ isReviewing }
					/>
					<NotificationEditorFooter
						isReviewing={ isReviewing }
						setIsReviewing={ setIsReviewing }
						goBack={ goBack }
						notificationId={ notificationId }
						properties={ { ...properties } }
						validationFlags={ { ...validationFlags } }
					/>
				</>
			) }
		</div>
	);
};

export default NotificationEditorWrapper;

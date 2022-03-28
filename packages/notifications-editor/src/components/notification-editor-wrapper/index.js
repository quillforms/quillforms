/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { keys, zipObject } from 'lodash';
import classnames from 'classnames';

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
	isActive,
	isAnimating,
} ) => {
	const [ properties, setProperties ] = useState( {
		...currentNotificationProperties,
	} );

	const [ isFormActive, setIsFormActive ] = useState( false );
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
		if ( activeSlide === 1 ) {
			setIsFormActive( true );
		} else {
			setIsFormActive( false );
		}
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
				.filter( ( field ) => field.name === 'email' ),
		};
	} );

	return (
		<div
			className={ classnames(
				'notifications-editor-notification-editor-wrapper',
				{
					active: isActive,
					'is-animating': isAnimating,
				}
			) }
		>
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
				<BaseControl>
					<ControlWrapper>
						<ControlLabel label="Active" />
						<ToggleControl
							checked={ active }
							onChange={ () => {
								setProperties( ( prevProperties ) => ( {
									...prevProperties,
									active: ! active,
								} ) );
							} }
						/>
					</ControlWrapper>
				</BaseControl>
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
				<BaseControl>
					<EmailSelect
						label="Reply to"
						emailFields={ emailFields }
						value={ replyTo }
						setValue={ ( val ) =>
							setProperties( ( prevProperties ) => ( {
								...prevProperties,
								replyTo: `{{field:${ val }}}`,
							} ) )
						}
					/>
				</BaseControl>
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
				{ isFormActive && (
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
				) }
				{ isActive && (
					<NotificationEditorFooter
						isReviewing={ isReviewing }
						setIsReviewing={ setIsReviewing }
						goBack={ goBack }
						notificationId={ notificationId }
						properties={ { ...properties } }
						validationFlags={ { ...validationFlags } }
					/>
				) }
			</>
		</div>
	);
};

export default NotificationEditorWrapper;

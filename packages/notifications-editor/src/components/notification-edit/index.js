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
import { Icon, arrowLeft } from '@wordpress/icons';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import uniq from 'lodash/uniq';
import CloseIcon from '@material-ui/icons/Close';

/**
 * Internal Dependencies
 */
import EmailInserter from '../../components/email-inserter';
import ReplyTo from '../../components/reply-to';
import EmailMessage from '../../components/email-message';
import EmailSubject from '../email-subject';

const NotificationEdit = ( { sliderRef } ) => {
	const [ recipients, setRecipients ] = useState( [] );
	const [ replyTo, setReplyTo ] = useState( '' );
	const [ subject, setSubject ] = useState( '' );
	const [ message, setMessage ] = useState( '' );

	const { emailFields } = useSelect( ( select ) => {
		return {
			emailFields: select( 'quillForms/block-editor' )
				.getFormStructure()
				.filter( ( field ) => field.type === 'email' ),
		};
	} );
	return (
		<div className="notifications-editor-notification-edit">
			<div
				role={ 'presentation' }
				className="notifications-editor-notification-edit__back"
				onClick={ () => {
					sliderRef.current.slickPrev();
				} }
			>
				<Icon
					className="notifications-editor-notification-edit__back-icon"
					icon={ arrowLeft }
					size={ 15 }
				/>
				Back to notifications list
			</div>
			<__experimentalBaseControl>
				<__experimentalControlWrapper>
					<__experimentalControlLabel label="Active" />
					<ToggleControl checked={ true } />
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="vertical">
					<__experimentalControlLabel label="Send a notification to" />
					<div className="email__inserterWrapper">
						{ recipients.length > 0 && (
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
														setRecipients(
															uniq(
																newRecipients
															)
														);

														// setNotificationsProperties(
														// 	{
														// 		recipients: uniq(
														// 			newRecipients
														// 		),
														// 	}
														// );
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
								setRecipients( uniq( newRecipients ) );
							} }
						/>
					</div>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<ReplyTo
				emailFields={ emailFields }
				value={ replyTo }
				setValue={ ( val ) => setReplyTo( val ) }
			/>
			<EmailSubject
				value={ subject }
				setValue={ ( val ) => setSubject( val ) }
			/>
			<EmailMessage
				value={ message }
				setValue={ ( val ) => setMessage( val ) }
			/>
		</div>
	);
};

export default NotificationEdit;

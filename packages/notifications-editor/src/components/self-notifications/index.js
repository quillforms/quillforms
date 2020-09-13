/**
 * QuillForms Dependencies
 */
import {
	ToggleControl,
	__experimentalBaseControl,
	__experimentalControlLabel,
	__experimentalControlWrapper,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';

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
import EmailSubject from '../../components/email-subject';
import EmailMessage from '../../components/email-message';

const SelfNotifications = () => {
	const { setNotificationsProperties } = useDispatch(
		'quillForms/notifications'
	);
	const { selfNotifications } = useSelect( ( select ) => {
		return {
			selfNotifications: select(
				'quillForms/notifications'
			).getSelfNotificationsState(),
		};
	} );

	const { emailFields } = useSelect( ( select ) => {
		return {
			emailFields: select( 'quillForms/block-editor' )
				.getFormStructure()
				.filter( ( field ) => field.type === 'email' ),
		};
	} );

	const {
		enabled,
		recipients,
		subject,
		replyTo,
		message,
	} = selfNotifications;
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper>
					<__experimentalControlLabel label="Receive an email when someone completes the form" />
					<ToggleControl
						onChange={ () => {
							setNotificationsProperties( {
								enabled: ! enabled,
							} );
						} }
						checked={ enabled }
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			{ enabled && (
				<Fragment>
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
																if (
																	index > -1
																) {
																	newRecipients.splice(
																		index,
																		1
																	);
																}

																setNotificationsProperties(
																	{
																		recipients: uniq(
																			newRecipients
																		),
																	}
																);
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
										setNotificationsProperties( {
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
							setNotificationsProperties( { replyTo: val } )
						}
					/>
					<EmailSubject
						value={ subject }
						setValue={ ( val ) =>
							setNotificationsProperties( { subject: val } )
						}
					/>
					<EmailMessage
						value={ message }
						setValue={ ( val ) =>
							setNotificationsProperties( { message: val } )
						}
					/>
				</Fragment>
			) }
		</Fragment>
	);
};
export default SelfNotifications;

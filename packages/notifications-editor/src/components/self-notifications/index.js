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
			{ enabled && <Fragment></Fragment> }
		</Fragment>
	);
};
export default SelfNotifications;

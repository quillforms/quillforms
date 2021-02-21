/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	TextControl,
} from '@quillforms/admin-components';

const NotificationTitle = ( { value, setValue } ) => {
	return (
		<div className="notifications-editor-notification-title">
			<__experimentalBaseControl>
				<__experimentalControlWrapper>
					<__experimentalControlLabel label="Title" />
					<TextControl
						value={ value }
						onChange={ ( val ) => {
							setValue( {
								title: val,
							} );
						} }
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
		</div>
	);
};

export default NotificationTitle;

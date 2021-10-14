/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

const NotificationTitle = ( { value, setValue } ) => {
	return (
		<div className="notifications-editor-notification-title">
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label="Title" />
					<TextControl
						value={ value }
						onChange={ ( val ) => {
							setValue( {
								title: val,
							} );
						} }
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};

export default NotificationTitle;

/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';
import { __ } from '@wordpress/i18n';

const NotificationTitle = ({ value, setValue }) => {
	return (
		<div className="notifications-editor-notification-title">
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={__('Title', 'quillforms')} />
					<TextControl
						value={value}
						onChange={(val) => {
							setValue({
								title: val,
							});
						}}
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};

export default NotificationTitle;

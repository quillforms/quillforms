/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { RichTextControl } from '@quillforms/rich-text';
/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

const MessageEdit = ( {
	messageKey,
	editingComplete,
	value,
	defaultValue,
	mergeTags,
} ) => {
	const { setMessage } = useDispatch( 'quillForms/messages-editor' );
	const [ val, setVal ] = useState( value );

	return (
		<div className="messages-editor-message-edit">
			<RichTextControl
				mergeTags={ mergeTags }
				value={ val ? val : '' }
				setValue={ ( newVal ) => {
					setVal( newVal );
				} }
				focusOnMount={ true }
			/>

			<div className="messages-editor-message-edit__actions">
				<Button
					className="messages-editor-message-edit__actions-apply-btn"
					isSmall
					isPrimary
					onClick={ ( e ) => {
						e.stopPropagation();
						setMessage( messageKey, val );
						editingComplete();
					} }
				>
					Apply
				</Button>
				<Button
					className="messages-editor-message-edit__actions-defaults-btn"
					isSmall
					onClick={ ( e ) => {
						e.stopPropagation();
						setMessage( messageKey, defaultValue );
						editingComplete();
					} }
				>
					Restore Defaults
				</Button>
			</div>
		</div>
	);
};
export default MessageEdit;

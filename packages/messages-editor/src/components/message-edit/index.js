/**
 * QuillForms Dependencies
 */
import {
	TextControl,
	Button,
	RichTextControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

const MessageEdit = ( {
	format,
	messageKey,
	editingComplete,
	value,
	defaultValue,
	variables,
	maxLength,
} ) => {
	const { setMessage } = useDispatch( 'quillForms/messages-editor' );
	const [ val, setVal ] = useState( value );
	return (
		<div className="messages-editor-message-edit">
			{ format && format === 'html' ? (
				<RichTextControl
					maxLength={ maxLength ? maxLength : null }
					variables={ variables }
					value={ val }
					setValue={ ( newVal ) => {
						setVal( newVal );
					} }
					forceFocusOnMount={ true }
				/>
			) : (
				<TextControl
					maxLength={ maxLength ? maxLength : null }
					value={ val }
					setValue={ ( newVal ) => {
						setVal( newVal );
					} }
					forceFocusOnMount={ true }
				/>
			) }

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

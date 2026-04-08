/**
 * QuillForms Dependencies
 */
import { RichTextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState } from 'react';

const MessageEdit = ( {
	allowedFormats,
	messageKey,
	editingComplete,
	value,
	defaultValue,
	mergeTags,
} ) => {
	const { setMessage } = useDispatch( 'quillForms/messages-editor' );
	const [ val, setVal ] = useState( value );
	const isChanged = ( val ?? '' ) !== ( defaultValue ?? '' );

	return (
		<div className="messages-editor-message-edit">
			<RichTextControl
				mergeTags={ mergeTags }
				value={ val ? val : '' }
				setValue={ ( newVal ) => {
					setVal( newVal );
					setMessage( messageKey, newVal );
				} }
				focusOnMount={ true }
				allowedFormats={ allowedFormats }
			/>

			<div className="messages-editor-message-edit__actions">
				{ isChanged && (
					<button
						type="button"
						className="messages-editor-message-edit__actions-reset-btn"
						onClick={ ( e ) => {
							e.stopPropagation();
							setVal( defaultValue );
							setMessage( messageKey, defaultValue );
						} }
						aria-label="Restore default message"
						title="Restore default message"
					>
						&#8634;
					</button>
				) }
				<button
					type="button"
					className="messages-editor-message-edit__actions-close-btn"
					onClick={ ( e ) => {
						e.stopPropagation();
						editingComplete();
					} }
				>
					Done
				</button>
			</div>
		</div>
	);
};
export default MessageEdit;

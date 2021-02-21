/**
 * QuillForms Dependencies
 */
import { useGlobalEditorContext } from '@quillforms/admin-components';
/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import MessageRow from '../message-row';

const PanelRender = () => {
	const { schemas } = useGlobalEditorContext();
	const messagesSchema = schemas?.messages ? schemas.messages : {};
	const { messages } = useSelect( ( select ) => {
		return {
			messages: select( 'quillForms/messages-editor' ).getMessages(),
		};
	} );

	const [ messageToEdit, setMessageToEdit ] = useState( null );

	return (
		<div className="messages-editor-panel-render">
			{ Object.keys( messagesSchema ).map( ( messageKey ) => {
				return (
					<MessageRow
						messageToEdit={ messageToEdit }
						setMessageToEdit={ setMessageToEdit }
						key={ messageKey }
						messageKey={ messageKey }
						label={ messagesSchema[ messageKey ].title }
						mergeTags={ messagesSchema[ messageKey ].mergeTags }
						format={ messagesSchema[ messageKey ].format }
						value={ messages[ messageKey ] }
						defaultValue={ messagesSchema[ messageKey ].default }
					/>
				);
			} ) }
		</div>
	);
};

export default PanelRender;

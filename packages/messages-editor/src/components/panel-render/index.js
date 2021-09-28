/**
 * QuillForms Dependencies
 */
import configApi from '@quillforms/config';

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
	const messagesStructure = configApi.getMessagesStructure();
	const { messages } = useSelect( ( select ) => {
		return {
			messages: select( 'quillForms/messages-editor' ).getMessages(),
		};
	} );

	const [ messageToEdit, setMessageToEdit ] = useState( null );

	return (
		<div className="messages-editor-panel-render">
			{ Object.keys( messagesStructure ).map( ( messageKey, index ) => {
				return (
					<MessageRow
						index={ index }
						messageToEdit={ messageToEdit }
						setMessageToEdit={ setMessageToEdit }
						key={ messageKey }
						messageKey={ messageKey }
						label={ messagesStructure[ messageKey ].title }
						mergeTags={ messagesStructure[ messageKey ].mergeTags }
						format={ messagesStructure[ messageKey ].format }
						value={
							messages[ messageKey ]
								? messages[ messageKey ]
								: messagesStructure[ messageKey ].default
						}
						allowedFormats={
							messagesStructure[ messageKey ].allowedFormats
						}
						defaultValue={ messagesStructure[ messageKey ].default }
					/>
				);
			} ) }
		</div>
	);
};

export default PanelRender;

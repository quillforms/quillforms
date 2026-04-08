/**
 * QuillForms Dependencies
 */
import configApi from '@quillforms/config';
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useDispatch } from '@wordpress/data';
import { useState } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import MessageRow from '../message-row';
import ArrowUpIcon from '../icons/arrow-up';
import ArrowRightIcon from '../icons/arrow-right';
import ResetIcon from '../icons/reset';

const PanelRender = () => {
	const messagesStructure = configApi.getMessagesStructure();
	const { setMessage } = useDispatch( 'quillForms/messages-editor' );
	const { messages } = useSelect( ( select ) => {
		return {
			messages: select( 'quillForms/messages-editor' ).getMessages(),
		};
	} );

	const [ messageToEdit, setMessageToEdit ] = useState( null );
	const [ openCategory, setOpenCategory ] = useState( null );

	const categoryLabels = {
		'buttons-navigation': __( 'Buttons & Navigation', 'quillforms' ),
		'hints-placeholders': __( 'Hints & Placeholders', 'quillforms' ),
		alerts: __( 'Alerts', 'quillforms' ),
	};

	const groupedMessages = Object.keys( messagesStructure ).reduce(
		( groups, messageKey ) => {
			const category = messagesStructure[ messageKey ]?.category;
			const groupKey = category || 'general';

			if ( ! groups[ groupKey ] ) {
				groups[ groupKey ] = [];
			}
			groups[ groupKey ].push( messageKey );
			return groups;
		},
		{}
	);

	const preferredOrder = [
		'buttons-navigation',
		'hints-placeholders',
		'alerts',
		'general',
	];
	const categoryKeys = [
		...preferredOrder.filter( ( key ) => groupedMessages[ key ]?.length ),
		...Object.keys( groupedMessages ).filter(
			( key ) => ! preferredOrder.includes( key )
		),
	];
	const activeCategory = openCategory ?? categoryKeys[ 0 ];

	return (
		<div className="messages-editor-panel-render">
			{ categoryKeys.map( ( categoryKey, categoryIndex ) => {
				const isOpen = activeCategory === categoryKey;
				const categoryTitle =
					categoryLabels[ categoryKey ] || categoryKey.replace( /-/g, ' ' );

				return (
					<div
						className="messages-editor-panel-render__group"
						key={ categoryKey }
					>
						<button
							type="button"
							className="messages-editor-panel-render__group-header"
							onClick={ () => {
								setOpenCategory(
									isOpen ? null : categoryKey
								);
							} }
						>
							<span className="messages-editor-panel-render__group-title">
								{ `${ categoryIndex + 1 }- ${ categoryTitle }` }
							</span>
							<span

							>
								{isOpen ? <ArrowUpIcon/> : <ArrowRightIcon/>}
							</span>
						</button>
						{ isOpen && (
							<div className="messages-editor-panel-render__group-content">
								{ groupedMessages[ categoryKey ].map(
									( messageKey, index ) => (
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
									)
								) }
								<div className="messages-editor-panel-render__group-actions">
									<Button
										className="messages-editor-panel-render__restore-all-btn"
										onClick={ () => {
											groupedMessages[ categoryKey ].forEach(
												( messageKey ) => {
													setMessage(
														messageKey,
														messagesStructure[ messageKey ].default
													);
												}
											);
										} }
									>
										<ResetIcon color="#B2328C"/>
										{ __( 'Restore All Defaults', 'quillforms' ) }
									</Button>
									<Button

										className="messages-editor-panel-render__apply-btn"
										onClick={ () => {
											groupedMessages[ categoryKey ].forEach(
												( messageKey ) => {
													setMessage(
														messageKey,
														messages[ messageKey ] ??
															messagesStructure[ messageKey ].default
													);
												}
											);
										} }
									>
										{ __( 'Apply Changes', 'quillforms' ) }
									</Button>
								</div>
							</div>
						) }
					</div>
				);
			} ) }
		</div>
	);
};

export default PanelRender;

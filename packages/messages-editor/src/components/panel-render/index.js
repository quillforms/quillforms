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
		'input-constraints': __( 'Input Constraints', 'quillforms' ),
		'format-data-integrity': __( 'Format & Data Integrity', 'quillforms' ),
		'placeholders-field-labels': __(
			'Placeholders & Field Labels',
			'quillforms'
		),
		'instructional-hints': __( 'Instructional Hints', 'quillforms' ),
		'success-feedback': __( 'Success & Feedback', 'quillforms' ),
		'system-errors': __( 'System Errors', 'quillforms' ),
		other: __( 'Other Messages', 'quillforms' ),
	};

	const buttonNavigationKeys = new Set( [
		'label.button.ok',
		'label.yes.default',
		'label.no.default',
		'label.submitBtn',
		'label.previous',
		'label.next',
	] );

	const inputConstraintKeys = new Set( [
		'label.errorAlert.required',
		'label.errorAlert.selectionRequired',
		'label.errorAlert.range',
		'label.errorAlert.minNum',
		'label.errorAlert.maxNum',
		'label.errorAlert.maxCharacters',
		'label.errorAlert.minCharacters',
		'label.errorAlert.minChoices',
		'label.errorAlert.maxChoices',
	] );

	const formatDataIntegrityKeys = new Set( [
		'label.errorAlert.date',
		'label.errorAlert.number',
		'label.errorAlert.email',
		'label.errorAlert.emailRestrictedDomains',
		'label.errorAlert.emailDisallowedDomains',
		'label.errorAlert.url',
	] );

	const placeholdersFieldLabelsKeys = new Set( [
		'block.shortText.placeholder',
		'block.longText.placeholder',
		'block.email.placeholder',
		'block.number.placeholder',
		'block.dropdown.placeholder',
	] );

	const instructionalHintsKeys = new Set( [
		'label.hintText.enter',
		'label.hintText.key',
		'block.longText.hint',
		'block.longText.touchHint',
		'label.hintText.multipleSelection',
		'block.dropdown.noSuggestions',
		'label.progress.percent',
	] );

	const successFeedbackKeys = new Set( [
		'block.defaultThankYouScreen.label',
		'label.correct',
		'label.incorrect',
		'label.yourAnswer',
		'label.answersExplanation',
	] );

	const systemErrorsKeys = new Set( [
		'label.errorAlert.noConnection',
		'label.errorAlert.serverError',
	] );

	const getGroupKey = ( messageKey ) => {
		const messageTitle = (
			messagesStructure[ messageKey ]?.title || ''
		).toLowerCase();
		if ( buttonNavigationKeys.has( messageKey ) ) {
			return 'buttons-navigation';
		}
		if ( inputConstraintKeys.has( messageKey ) ) {
			return 'input-constraints';
		}
		if ( formatDataIntegrityKeys.has( messageKey ) ) {
			return 'format-data-integrity';
		}
		if ( placeholdersFieldLabelsKeys.has( messageKey ) ) {
			return 'placeholders-field-labels';
		}
		if ( instructionalHintsKeys.has( messageKey ) ) {
			return 'instructional-hints';
		}
		if ( successFeedbackKeys.has( messageKey ) ) {
			return 'success-feedback';
		}
		if ( systemErrorsKeys.has( messageKey ) ) {
			return 'system-errors';
		}
		if ( messageKey.includes( '.placeholder' ) ) {
			return 'placeholders-field-labels';
		}
		if ( messageKey.includes( 'hint' ) || messageKey.includes( 'progress' ) ) {
			return 'instructional-hints';
		}
		if ( messageKey.includes( 'errorAlert' ) ) {
			return 'format-data-integrity';
		}
		if (
			messageKey.includes( 'phone' ) ||
			messageTitle.includes( 'phone number' ) ||
			messageTitle.includes( 'phone' )
		) {
			return 'format-data-integrity';
		}
		return 'other';
	};

	const groupedMessages = Object.keys( messagesStructure ).reduce(
		( groups, messageKey ) => {
			const groupKey = getGroupKey( messageKey );

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
		'input-constraints',
		'format-data-integrity',
		'placeholders-field-labels',
		'instructional-hints',
		'success-feedback',
		'system-errors',
		'other',
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
				const rowOrientation =
					categoryKey === 'buttons-navigation' ? 'horizontal' : 'vertical';
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
											orientation={ rowOrientation }
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

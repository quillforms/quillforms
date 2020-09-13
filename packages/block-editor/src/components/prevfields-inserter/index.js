/**
 * QuillForms Dependencies
 */
import { Tooltip, RecallInformation } from '@quillforms/builder-components';

/**
 * WordPress Dependenciesd
 */
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

const PrevFieldsInserter = ( { onInsert, id } ) => {
	const [ anchorEl, setAnchorEl ] = useState( null );

	const { prevFields } = useSelect( ( select ) => {
		return {
			prevFields: select( 'quillForms/block-editor' )
				.getPreviousEditableFields( id )
				.map( ( field ) => {
					return {
						varType: 'field',
						title: field.title,
						ref: field.id,
					};
				} ),
		};
	} );

	return (
		<div className="block-editor-prev-fields-inserter">
			<Tooltip
				title="Recall Information"
				placement="bottom"
				arrow={ true }
			>
				<div
					role="presentation"
					className="block-editor-block-toolbar__controls-icon"
					onClick={ ( event ) => {
						setAnchorEl( event.currentTarget );
					} }
				>
					@
				</div>
			</Tooltip>
			<RecallInformation
				anchorEl={ anchorEl }
				variables={ prevFields }
				insertVariable={ onInsert }
				onClose={ () => {
					setAnchorEl( null );
				} }
				setAnchorEl={ setAnchorEl }
			/>
		</div>
	);
};
export default PrevFieldsInserter;

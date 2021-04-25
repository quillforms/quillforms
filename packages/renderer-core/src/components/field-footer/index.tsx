/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import EditableBlockFooter from './editable';
import NonEditableBlockFooter from './non-editable';
import { useFieldRenderContext } from '../field-render';

export interface BlockFooterProps {
	shakingErr: string | null;
}
const BlockFooter: React.FC< BlockFooterProps > = ( { shakingErr } ) => {
	const { id, blockName } = useFieldRenderContext();
	if ( ! blockName ) return null;
	const { isEditable } = useSelect( ( select ) => {
		return {
			isEditable: select( 'quillForms/blocks' ).hasBlockSupport(
				blockName,
				'editable'
			),
		};
	} );
	return (
		<div className="renderer-core-field-footer">
			{ ! isEditable ? (
				<NonEditableBlockFooter />
			) : (
				<EditableBlockFooter id={ id } shakingErr={ shakingErr } />
			) }
		</div>
	);
};
export default BlockFooter;

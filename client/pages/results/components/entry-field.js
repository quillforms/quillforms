/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';

const EntryField = ( {
	order,
	name,
	label,
	value,
	rawValue,
	id,
	attributes,
} ) => {
	const { blockType } = useSelect( ( select ) => {
		return {
			blockType: select( 'quillForms/blocks' ).getBlockType( name ),
		};
	} );

	return (
		<li>
			<div className="qf-entry-field-header">
				<BlockIconBox
					icon={ blockType?.icon }
					color={ blockType?.color }
				/>
				<div
					className="qf-entry-field-header-label"
					dangerouslySetInnerHTML={ {
						__html: label ?? '...',
					} }
				></div>
			</div>

			<div
				className={ classnames( 'qf-entry-field-value', {
					empty: ! value,
				} ) }
			>
				{ value && blockType?.entryDetails ? (
					<blockType.entryDetails
						value={ rawValue }
						id={ id }
						attributes={ attributes }
					/>
				) : (
					<div
						dangerouslySetInnerHTML={ {
							__html: value ?? 'No response',
						} }
					></div>
				) }
			</div>
		</li>
	);
};
export default EntryField;

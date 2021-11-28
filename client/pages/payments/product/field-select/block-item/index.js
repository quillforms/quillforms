/**
 * QuillForms Dependencies
 */
import { BlockIconBox } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import './style.scss';

const BlockItem = ( { id, name, label } ) => {
	const { blockType } = useSelect( ( select ) => {
		return {
			blockType: select( 'quillForms/blocks' ).getBlockType( name ),
		};
	} );

	return (
		<div className="quillforms-payments-page-block-item">
			{ blockType && (
				<>
					<div
						style={ {
							background: blockType?.color,
						} }
						className="quillforms-payments-page-dropdown-menu-item__hidden-div"
					/>
					<BlockIconBox
						icon={ blockType?.icon }
						color={ blockType?.color }
					/>
					<div className="quillforms-payments-page-block-item__label">{ label }</div>
				</>
			) }
		</div>
	);
};

export default BlockItem;

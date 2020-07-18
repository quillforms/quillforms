/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import AddIcon from '@material-ui/icons/Add';

/**
 * Internal Dependencies
 */
import BlockIconWrapper from './wrapper';

const BlockIconBox = ( { blockType = 'variable', blockOrder } ) => {
	const { blocks } = useSelect( ( select ) => {
		return {
			blocks: select( 'quillForms/blocks' ).getBlocks(),
		};
	} );
	const isBlock = !! blocks[ blockType ];
	let config = {};
	if ( isBlock ) {
		config = blocks[ blockType ].editorConfig;
	} else {
		config.color = '#3a7685';
		config.icon = AddIcon;
	}
	return (
		<BlockIconWrapper color={ config.color }>
			<config.icon />
			{ blockOrder && (
				<span className="block-editor-block-icon-box__block-order">
					{ blockOrder }
				</span>
			) }
		</BlockIconWrapper>
	);
};
export default BlockIconBox;

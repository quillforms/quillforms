/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, Icon as IconType } from '@quillforms/types';

/**
 * Internal Dependencies
 */
import { getPlainExcerpt } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Icon, Dashicon } from '@wordpress/components';
import { blockDefault, plus } from '@wordpress/icons';
import { useSelect } from '@wordpress/data';

interface Props {
	name: string;
	id: string;
}
const DraggedBlock: React.FC< Props > = ( { name, id } ) => {
	const { blockType, block } = useSelect( ( select ) => {
		return {
			blockType: select( 'quillForms/blocks' ).getBlockType( name ),
			block: select( 'quillForms/block-editor' ).getBlockById( id ),
		};
	} );
	let icon = blockType?.icon;
	if ( ( ( icon as IconDescriptor )?.src as IconType ) === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}
	if ( ! icon ) {
		icon = plus;
	}

	const renderedIcon = (
		<Icon
			icon={
				( ( icon as IconDescriptor )?.src as IconType )
					? ( ( icon as IconDescriptor ).src as IconType )
					: ( icon as Dashicon.Icon )
			}
		/>
	);

	const blockLabel = getPlainExcerpt( block?.attributes?.label );
	return (
		<div className="block-editor-block-dragging__wrapper">
			<div className="block-editor-block-dragging">
				<div
					className="block-editor-block-dragging__icon-box"
					style={ {
						background: blockType?.color
							? blockType.color
							: '#bb426f',
					} }
				>
					{ renderedIcon }
				</div>
				<div
					className="block-editor-block-dragging__title-excerpt"
					dangerouslySetInnerHTML={ { __html: blockLabel } }
				/>
			</div>
		</div>
	);
};
export default DraggedBlock;

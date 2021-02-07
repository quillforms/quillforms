/**
 * Internal Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { blockDefault, plus } from '@wordpress/icons';

const DraggedBlock = ( { block, item } ) => {
	let icon = block?.editorConfig?.icon;
	if ( icon?.src === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}
	if ( ! icon ) {
		icon = plus;
	}
	const renderedIcon = <Icon icon={ icon?.src ? icon.src : icon } />;

	const itemTitle = getPlainExcerpt( item.title );
	return (
		<div className="block-editor-block-dragging__wrapper">
			<div className="block-editor-block-dragging">
				<div
					className="block-editor-block-dragging__icon-box"
					style={ {
						background: block?.editorConfig?.color
							? block.editorConfig.color
							: '#bb426f',
					} }
				>
					{ renderedIcon }
				</div>
				<div
					className="block-editor-block-dragging__title-excerpt"
					dangerouslySetInnerHTML={ { __html: itemTitle } }
				/>
			</div>
		</div>
	);
};
export default DraggedBlock;

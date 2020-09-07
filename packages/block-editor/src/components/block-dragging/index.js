/**
 * Internal Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';

const DraggedBlock = ( { block, item } ) => {
	const itemTitle = getPlainExcerpt( item.title );
	return (
		<div className="block-editor-block-dragging__wrapper">
			<div className="block-editor-block-dragging">
				<div
					className="block-editor-block-dragging__icon-box"
					style={ { background: block.editorConfig.color } }
				>
					<block.editorConfig.icon />
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

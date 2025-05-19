/**
 * WordPresss Dependencies
 */
import { memo } from '@wordpress/element';
/**
 * Internal Dependencies
 */
import BlockCounter from '../field-counter';
import BlockTitle from '../field-label';
import BlockDescription from '../field-description';
import BlockAttachment from '../field-attachment';
import BlockCustomHTML from '../field-custom-html';
import { __experimentalUseFieldRenderContext } from '../field-render';
import { useMediaQuery } from "@uidotdev/usehooks";
import { useBlockTypes, useFormContext, useFormSettings } from '../../hooks';

const QuestionHeader: React.FC = memo(() => {
	const { blockName, id, attributes } = __experimentalUseFieldRenderContext();
	const { editor } = useFormContext();
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	const blockTypes = useBlockTypes();
	const showQuestionsNumbers =
		useFormSettings()?.showQuestionsNumbers ?? true;

	if (!blockName || !id) return null;

	const blockType = blockTypes[blockName];

	const layout = isSmallDevice ? 'stack' : attributes?.layout ?? 'stack';
	return (
		<div className="renderer-components-question-header" onClick={() => {
			if (editor.mode === 'on' && editor.onClick)
				editor.onClick(id)
		}}>
			{(showQuestionsNumbers || blockType?.counterIcon) && (
				<BlockCounter
					id={id}
					attributes={attributes}
					blockType={blockType}
				/>
			)}
			<BlockTitle />
			<BlockDescription />
			{(layout === 'stack' && <BlockAttachment />)}
			<BlockCustomHTML />
		</div>
	);
});

export default QuestionHeader;

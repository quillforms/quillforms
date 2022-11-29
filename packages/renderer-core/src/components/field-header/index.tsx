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

const QuestionHeader: React.FC = memo( () => {
	const { attributes } = __experimentalUseFieldRenderContext();
	const layout = attributes?.layout ?? 'stack';
	return (
		<div className="renderer-components-question-header">
			<BlockCounter />
			<BlockTitle />
			<BlockDescription />
			{ layout === 'stack' && <BlockAttachment /> }
			<BlockCustomHTML />
		</div>
	);
} );

export default QuestionHeader;

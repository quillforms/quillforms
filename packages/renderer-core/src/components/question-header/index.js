/**
 * Internal Dependencies
 */
import BlockCounter from '../block-counter';
import BlockTitle from '../block-title';
import BlockDescription from '../block-description';
import BlockAttachment from '../block-attachment';

const QuestionHeader = () => {
	return (
		<div className="renderer-components-question-header">
			<BlockCounter />
			<BlockTitle />
			<BlockDescription />
			<BlockAttachment />
		</div>
	);
};

export default QuestionHeader;

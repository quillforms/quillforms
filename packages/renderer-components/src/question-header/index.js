/**
 * Internal Dependencies
 */
import {
	BlockCounter,
	BlockTitle,
	BlockAttachment,
	BlockDescription,
} from '..';
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

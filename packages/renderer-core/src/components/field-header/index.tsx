/**
 * WordPresss Dependencies
 */
import { memo } from 'react';
/**
 * Internal Dependencies
 */
import BlockCounter from '../field-counter';
import BlockTitle from '../field-label';
import BlockDescription from '../field-description';
import BlockAttachment from '../field-attachment';

const QuestionHeader: React.FC = memo( () => {
	return (
		<div className="renderer-components-question-header">
			<BlockCounter />
			<BlockTitle />
			<BlockDescription />
			<BlockAttachment />
		</div>
	);
} );

export default QuestionHeader;

/**
 * Internal Dependencies
 */
import {
	BlockCounter,
	BlockTitle,
	BlockAttachment,
	BlockDescription,
} from '..';
const QuestionHeader = ( {
	title,
	counter,
	dispalyOnly,
	addDescription,
	description,
	attachment,
	isAttachmentSupported,
} ) => {
	return (
		<div className="renderer-components-question-header">
			{ ! dispalyOnly && <BlockCounter counter={ counter } /> }
			<BlockTitle title={ title } />
			{ addDescription && (
				<BlockDescription description={ description } />
			) }
			{ isAttachmentSupported && attachment && (
				<BlockAttachment attachment={ attachment } />
			) }
		</div>
	);
};

export default QuestionHeader;

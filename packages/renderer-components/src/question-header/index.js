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
	displayOnly,
	description,
	attachment,
	isAttachmentSupported,
	attributes,
} ) => {
	return (
		<div className="renderer-components-question-header">
			<BlockCounter
				attributes={ attributes }
				counter={ counter }
				displayOnly={ displayOnly }
			/>
			<BlockTitle title={ title } />
			{ description && <BlockDescription description={ description } /> }
			{ isAttachmentSupported && attachment && (
				<BlockAttachment attachment={ attachment } />
			) }
		</div>
	);
};

export default QuestionHeader;

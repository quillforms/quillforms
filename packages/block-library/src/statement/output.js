/**
 * Internal Packages
 */
import {
	QuestionBody,
	BlockTitle,
	BlockAttachment,
	BlockDescription,
	FieldAction,
} from '@quillforms/renderer-components';

const StatementOutput = ( {
	title,
	addDescription,
	description,
	attachment,
	attributes,
	next,
} ) => {
	const { buttonText, quotationMarks } = attributes;

	return (
		<div style={ { outline: 'none' } }>
			<div className="question__header">
				<BlockTitle title={ title } />
				{ quotationMarks && (
					<div className="quote-icon">
						<svg
							strokeWidth="0"
							viewBox="0 0 14 16"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M6.16 3.5C3.73 5.06 2.55 6.67 2.55 9.36c.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.9 0-2.99-1.52-2.99-4.25 0-3.8 1.75-6.53 5.02-8.42L6.16 3.5zm7 0c-2.43 1.56-3.61 3.17-3.61 5.86.16-.05.3-.05.44-.05 1.27 0 2.5.86 2.5 2.41 0 1.61-1.03 2.61-2.5 2.61-1.89 0-2.98-1.52-2.98-4.25 0-3.8 1.75-6.53 5.02-8.42l1.14 1.84h-.01z"
							/>
						</svg>
					</div>
				) }
				{ addDescription && (
					<BlockDescription description={ description } />
				) }
				<BlockAttachment attachment={ attachment } />
			</div>
			<QuestionBody>
				<div style={ { marginTop: '20px' } }>
					<FieldAction
						show={ true }
						text={ buttonText }
						clickHandler={ () => {
							next();
						} }
					/>
				</div>
			</QuestionBody>
		</div>
	);
};

export default StatementOutput;

/**
 * Internal Dependencies
 */
import { forEach } from 'lodash';
import useCorrectAnswersCount from '../../hooks/use-correct-answers-count';
import useIncorrectAnswersCount from '../../hooks/use-incorrect-answers-count';

/**
 * WordPress Dependencies
 */
import { useSelect } from "@wordpress/data";
import HtmlParser from '../html-parser';
import { useBlockTheme, useCorrectIncorrectQuiz, useMessages, useTheme } from '../../hooks';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import { __experimentalUseFieldRenderContext } from '../field-render';

interface Props {
	modifier: string;
}
const QuizMergeTag: React.FC<Props> = ({ modifier }) => {
	const correctIncorrectQuiz = useCorrectIncorrectQuiz();
	const { attributes } = __experimentalUseFieldRenderContext();
	const theme = useBlockTheme(attributes?.themeId)
	const messages = useMessages();
	const { fieldsSupportQuiz, answers } = useSelect((select) => {
		const { getFieldsBySupportCriteria } = select('quillForms/renderer-core');
		return {
			fieldsSupportQuiz: getFieldsBySupportCriteria(['correctAnswers']),
			answers: select('quillForms/renderer-core')?.getAnswers(),
		};
	});
	const correctAnswersCount = useCorrectAnswersCount();
	const inCorrectAnswersCount = useIncorrectAnswersCount();
	if (modifier === 'correct_answers_count') {
		return <>{correctAnswersCount}</>;
	}

	else if (modifier === 'incorrect_answers_count') {
		return <>{inCorrectAnswersCount}</>;
	}

	else if (modifier === 'summary') {
		return (
			<div>
				{fieldsSupportQuiz.map((field, index) => {
					// first div add dangerouslySetInnerHTML
					return (
						<div className={css`
							font-size: ${theme.fontSize.lg};
							@media screen and (max-width: 768px) {
								font-size: ${theme.fontSize.sm}
							}
							margin-bottom: 14px;
						`}>
							<div
								dangerouslySetInnerHTML={{
									__html: index + 1 + "- " + field.attributes?.label?.replace(
										/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g,
										(_match, p1, p2) => {
											return `______`;
										}
									)
								}}
							/>
							<div>
								{messages['label.yourAnswer']}: <HtmlParser value={`{{field:${field.id}}}`} />
							</div>
							<div className={css`
								margin-top:8px;
								color: #fff;
								background: ${answers[field.id]?.isCorrect ? '#5bc68a' : '#d93148'};
								padding: 5px 8px;
								display: inline-flex;
							`}>
								{answers[field.id]?.isCorrect ? messages['label.correct'] : messages['label.incorrect']}
							</div>

						</div>
					)
				})}
			</div>
		)

	}
	return null;
};

export default QuizMergeTag;

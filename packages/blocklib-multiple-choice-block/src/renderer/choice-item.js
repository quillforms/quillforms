/**
 * QuillForms Depndencies
 */
import { useMessages } from '@quillforms/renderer-core';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import { useState } from 'react';
import tinyColor from 'tinycolor2';

const ChoiceItem = ({
	order,
	selected,
	choiceLabel,
	choiceValue,
	clickHandler,
	theme,
	isAnswerLocked,
	blockId,
	correctIncorrectQuiz
}) => {
	const { answersColor } = theme;

	const messages = useMessages();
	const [isClicked, setIsClicked] = useState(false);
	return (
		<div
			role="presentation"
			className={classnames(
				'multipleChoice__optionWrapper',
				{
					selected,
					locked: isAnswerLocked,
					clicked: isClicked,
					correct: isAnswerLocked && correctIncorrectQuiz?.enabled && correctIncorrectQuiz?.showAnswersDuringQuiz && correctIncorrectQuiz?.questions?.[blockId]?.correctAnswers?.includes(choiceValue),
					wrong: isAnswerLocked && correctIncorrectQuiz?.enabled && correctIncorrectQuiz?.showAnswersDuringQuiz && selected && !correctIncorrectQuiz?.questions?.[blockId]?.correctAnswers?.includes(choiceValue)
				},
				css`
					background: ${tinyColor(answersColor)
						.setAlpha(0.1)
						.toString()};

					border-color: ${answersColor};
					color: ${answersColor};

					${!isAnswerLocked && `&:hover {
						background: ${tinyColor(answersColor)
						.setAlpha(0.2)
						.toString()};
					}`}

					&.selected {
						background: ${tinyColor(answersColor)
						.setAlpha(0.75)
						.toString()};
						color: ${tinyColor(answersColor).isDark()
						? '#fff'
						: '#333'};

						.multipleChoice__optionKey {
							color: ${tinyColor(answersColor).isDark()
						? '#fff'
						: '#333'};

							border-color: ${tinyColor(answersColor).isDark()
						? '#fff'
						: '#333'};
						}
					}

					&.locked {
						pointer-events: none;
						cursor: default !important;
					}
				`
			)}
			onClick={() => {
				if (!isAnswerLocked) {

					clickHandler();
					if (!selected) {
						setIsClicked(false);
						setTimeout(() => {
							setIsClicked(true);
						}, 0);
					}
				}
			}}
		>
			<span className="multipleChoice__optionLabel">{choiceLabel}</span>
			<span
				className={classnames(
					'multipleChoice__optionKey',
					css`
						background: ${tinyColor(answersColor)
							.setAlpha(0.1)
							.toString()};
						color: ${answersColor};
						border-color: ${tinyColor(answersColor)
							.setAlpha(0.4)
							.toString()};
					`
				)}
			>
				<span
					className={classnames(
						'multipleChoice__optionKeyTip',
						css`
							background: ${answersColor};
							color: ${tinyColor(answersColor).isDark()
								? '#fff'
								: '#333'};
							${isAnswerLocked && `display: none !important;`}
						`
					)}
				>
					{messages['label.hintText.key']}
				</span>
				{order}
			</span>
		</div>
	);
};

export default ChoiceItem;

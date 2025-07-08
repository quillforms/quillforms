/**
 * QuillForms Depndencies
 */
import { useMessages } from '@quillforms/renderer-core';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import { useState, useEffect } from 'react';
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
	correctIncorrectQuiz,
	isOther,
	val,
	setVal,
	checkfieldValidation
}) => {
	const { answersColor } = theme;

	const messages = useMessages();
	const [isClicked, setIsClicked] = useState(false);
	const [otherText, setOtherText] = useState('');

	// Initialize other text from existing value
	useEffect(() => {
		if (isOther && val && val.length > 0) {
			const otherValue = val.find(item => typeof item === 'object' && item.type === 'other');
			if (otherValue && otherValue.value) {
				setOtherText(otherValue.value);
			}
		}
	}, [isOther, val]);

	const handleOtherTextChange = (text) => {
		setOtherText(text);

		// Update the value in the parent component
		let $val = val ? [...val] : [];

		// Remove existing other value if any
		$val = $val.filter(item => !(typeof item === 'object' && item.type === 'other'));

		// Add new other value if text is not empty
		if (text.trim() !== '') {
			$val.push({
				type: 'other',
				value: text.trim()
			});
		}

		setVal($val);
		checkfieldValidation($val);
	};

	const handleOtherClick = () => {
		if (!isAnswerLocked) {
			let $val = val ? [...val] : [];

			if (selected) {
				// Remove other option
				$val = $val.filter(item => !(typeof item === 'object' && item.type === 'other'));
				setOtherText('');
			} else {
				// Add other option with empty text
				$val.push({
					type: 'other',
					value: ''
				});
			}

			setVal($val);
			checkfieldValidation($val);

			if (!selected) {
				setIsClicked(false);
				setTimeout(() => {
					setIsClicked(true);
				}, 0);
			}
		}
	};

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
					if (isOther) {
						handleOtherClick();
					} else {
						clickHandler();
						if (!selected) {
							setIsClicked(false);
							setTimeout(() => {
								setIsClicked(true);
							}, 0);
						}
					}
				}
			}}
		>
			<span className="multipleChoice__optionLabel">
				{choiceLabel}
				{isOther && selected && (
					<input
						type="text"
						value={otherText}
						onChange={(e) => handleOtherTextChange(e.target.value)}
						placeholder="Please specify..."
						className={css`
							margin-left: 8px;
							padding: 4px 8px;
							border: 1px solid ${tinyColor(answersColor).setAlpha(0.3).toString()};
							border-radius: 4px;
							background: transparent;
							color: inherit;
							font-size: inherit;
							font-family: inherit;
							width: 200px;
							
							&::placeholder {
								color: ${tinyColor(answersColor).setAlpha(0.6).toString()};
							}
							
							&:focus {
								outline: none;
								border-color: ${answersColor};
							}
						`}
						onClick={(e) => e.stopPropagation()}
					/>
				)}
			</span>
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

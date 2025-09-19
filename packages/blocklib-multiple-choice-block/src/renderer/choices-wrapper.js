/**
 * QuillForms Dependencies
 */
import { useBlockTheme, useFormContext } from '@quillforms/renderer-core';
import { useCx } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { memo, useCallback, useEffect, useRef } from 'react';

/**
 * External Dependencies
 */
import { cloneDeep, debounce } from 'lodash';

/**
 * Internal Dependencies
 */
import ChoiceItem from './choice-item';
import * as styles from './styles';

const ChoicesWrapper =
	({
		id,
		attributes,
		val,
		isActive,
		correctIncorrectQuiz,
		isAnswerLocked,
		setVal,
		setChoiceClicked,
		checkfieldValidation,
	}) => {
		const { editor } = useFormContext();

		const { verticalAlign, multiple, choices, themeId, max, min, other, otherText, otherPlaceholder, deselectAllWhenOtherSelected } = attributes;
		const cx = useCx();

		const theme = useBlockTheme(themeId);
		const charCode = 'a'.charCodeAt(0);
		// Simple algorithm to generate alphabatical idented order
		const identName = (a) => {
			const b = [a];
			let sp, out, i, div;

			sp = 0;
			while (sp < b.length) {
				if (b[sp] > 25) {
					div = Math.floor(b[sp] / 26);
					b[sp + 1] = div - 1;
					b[sp] %= 26;
				}
				sp += 1;
			}

			out = '';
			for (i = 0; i < b.length; i += 1) {
				out = String.fromCharCode(charCode + b[i]) + out;
			}

			return out;
		};

		const $verticalAlign = verticalAlign;
		let $choices = cloneDeep(choices).map(($choice, index) => {
			if (!$choice.label) $choice.label = 'Choice ' + (index + 1);
			// if ( ! verticalAlign && $choice.label.length > 26 )
			// 	$verticalAlign = true;
			$choice.selected =
				val && val.length > 0 && val.includes($choice.value)
					? true
					: false;
			$choice.order = identName(index);
			return $choice;
		});

		// Add "Other" option if enabled
		if (other) {
			const otherChoice = {
				value: 'other',
				label: otherText,
				selected: val && val.length > 0 && val.some(item => typeof item === 'object' && item.type === 'other'),
				order: identName($choices.length),
				isOther: true
			};
			$choices.push(otherChoice);
		}

		const clickHandler = (newValue, selected) => {
			let $val;
			if (val?.length > 0) {
				$val = cloneDeep(val);
			} else {
				$val = [];
			}
			if (selected) {
				if (!correctIncorrectQuiz?.enabled || !correctIncorrectQuiz?.showAnswersDuringQuiz) {
					// Remove the selected value
					if (typeof newValue === 'object' && newValue.type === 'other') {
						$val = $val.filter(item => !(typeof item === 'object' && item.type === 'other'));
					} else {
						$val.splice(
							$val.findIndex((item) => item === newValue),
							1
						);
					}
					setVal($val);
				}
			} else {
				if (multiple) {
					if (deselectAllWhenOtherSelected) {
						$val = $val.filter(item => item?.type !== 'other');
					}
					$val.push(newValue);
				} else {
					// If selecting 'Other', set value directly
					if (typeof newValue === 'object' && newValue.type === 'other') {
						$val = [newValue];
					} else {
						$val = [newValue];
					}
				}
				setChoiceClicked(false);
				setVal($val);
				checkfieldValidation($val);
				setTimeout(() => {
					setChoiceClicked(true);

				}, 10);

			}
		};

		const handleClick = useCallback(
			debounce((map) => {
				const pressedLetter = Object.values(map).join('');
				// //console.log(pressedLetter);
				// //console.log($choices)
				const $choiceIndex = $choices.findIndex(choice => choice.order.toUpperCase() === pressedLetter.toUpperCase());
				// //console.log($choiceIndex)
				document.querySelector(`#block-${id} .multiplechoice__options .multipleChoice__optionWrapper:nth-child(${$choiceIndex + 1})`)?.click();
				mappedKeyboardTicks = {};
			}, 100),
			[$choices]
		);
		let mappedKeyboardTicks = {}
		const valRef = useRef(val);
		useEffect(() => {
			valRef.current = val;
		}, [val]);

		const handleKeyDown = (e) => {
			console.log(valRef.current);
			if (!isAnswerLocked && editor.mode === 'off' && !valRef.current?.some(item => typeof item === 'object' && item.type === 'other')) {
				mappedKeyboardTicks[e.code] = String.fromCharCode(e.keyCode);
				handleClick(mappedKeyboardTicks);
			}
		}

		useEffect(() => {
			document.getElementById(`block-${id}`)?.addEventListener('keydown', handleKeyDown);
			return () => {
				document.getElementById(`block-${id}`)?.removeEventListener('keydown', handleKeyDown);
			};
		}, []);

		return (
			<div className="qf-multiple-choice-block">
				<div
					className={cx(
						'multiplechoice__options',
						{
							valigned: $verticalAlign,
						},
						styles.MultipleChoiceOptions
					)}
				>
					{$choices &&
						$choices.length > 0 &&
						$choices.map((choice, index) => {
							return (
								<ChoiceItem
									theme={theme}
									blockId={id}
									key={`block-multiple-choice-${id}-choice-${choice.value}`}
									choiceLabel={choice.label}
									choiceValue={choice.value}
									order={choice.order.toUpperCase()}
									isAnswerLocked={isAnswerLocked}
									selected={choice.selected}
									correctIncorrectQuiz={correctIncorrectQuiz}
									multiple={multiple}
									otherPlaceholder={otherPlaceholder}
									deselectAllWhenOtherSelected={deselectAllWhenOtherSelected}
									isOther={choice.isOther}
									otherText={otherText}
									val={val}
									setVal={setVal}
									checkfieldValidation={checkfieldValidation}
									clickHandler={() => {
										clickHandler(
											choice.value,
											choice.selected
										)

									}}
								/>
							);
						})}
				</div>
			</div>
		);
	};

export default ChoicesWrapper;

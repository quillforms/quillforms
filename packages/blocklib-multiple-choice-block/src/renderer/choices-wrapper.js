/**
 * QuillForms Dependencies
 */
import { useBlockTheme } from '@quillforms/renderer-core';
import { useCx } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { memo, useCallback, useEffect } from 'react';

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
		setVal,
		setChoiceClicked,
		checkfieldValidation,
	}) => {
		const { verticalAlign, multiple, choices, themeId, max, min } = attributes;
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
		const $choices = cloneDeep(choices).map(($choice, index) => {
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

		const clickHandler = (newValue, selected) => {
			let $val;
			if (val?.length > 0) {
				$val = cloneDeep(val);
			} else {
				$val = [];
			}
			if (selected) {
				$val.splice(
					$val.findIndex((item) => item === newValue),
					1
				);
				setVal($val);
			} else {
				if (multiple) {
					$val.push(newValue);
				} else {
					$val = [newValue];
				}
				setVal($val);
				setChoiceClicked(false);
				setTimeout(() => {
					setChoiceClicked(true);
				}, 0);
			}
			checkfieldValidation($val);
		};

		const handleClick = useCallback(
			debounce((map) => {
				const pressedLetter = Object.values(map).join('');
				// console.log(pressedLetter);
				// console.log($choices)
				const $choiceIndex = $choices.findIndex(choice => choice.order.toUpperCase() === pressedLetter.toUpperCase());
				// console.log($choiceIndex)
				document.querySelector(`#block-${id} .multiplechoice__options .multipleChoice__optionWrapper:nth-child(${$choiceIndex + 1})`)?.click();
				mappedKeyboardTicks = {};
			}, 100),
			[$choices]
		);
		let mappedKeyboardTicks = {}
		const handleKeyDown = (e) => {
			mappedKeyboardTicks[e.code] = String.fromCharCode(e.keyCode);
			handleClick(mappedKeyboardTicks);
		}

		useEffect(() => {
			document.getElementById(`block-${id}`)?.addEventListener('keydown', handleKeyDown);

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
									key={`block-multiple-choice-${id}-choice-${choice.value}`}
									choiceLabel={choice.label}
									choiceValue={choice.value}
									order={choice.order.toUpperCase()}
									selected={choice.selected}
									multiple={multiple}
									clickHandler={() =>
										clickHandler(
											choice.value,
											choice.selected
										)
									}
								/>
							);
						})}
				</div>
			</div>
		);
	};

export default ChoicesWrapper;

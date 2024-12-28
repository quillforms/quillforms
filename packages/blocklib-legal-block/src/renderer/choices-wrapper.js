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
		const { verticalAlign, yesLabel, noLabel, themeId } = attributes;
		const cx = useCx();

		const theme = useBlockTheme(themeId);


		const $verticalAlign = verticalAlign;
		const $choices = [{
			label: yesLabel,
			value: 'yes',
			order: 'Y',
			selected: val === 'yes'
		},
		{
			label: noLabel,
			value: 'no',
			order: 'N',
			selected: val === 'no'
		}
		]

		const clickHandler = (newValue, selected) => {
			let $val;
			if (selected) {
				$val = "";
				setVal('')
			} else {
				$val = newValue;
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
						$choices.map((choice, index) => {
							return (
								<ChoiceItem
									theme={theme}
									key={`block-multiple-choice-${id}-choice-${choice.value}`}
									choiceLabel={choice.label}
									choiceValue={choice.value}
									order={choice.order.toUpperCase()}
									selected={choice.selected}
									multiple={false}
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

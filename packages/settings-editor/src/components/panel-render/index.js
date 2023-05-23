/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	SelectControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const PanelRender = () => {
	const {
		disableProgressBar,
		disableWheelSwiping,
		disableNavigationArrows,
		changeAnimationDirection,
		showLettersOnAnswers,
		showQuestionsNumbers,
	} = useDispatch('quillForms/settings-editor');

	const {
		isProgressBarDisabled,
		isWheelSwipingDisabled,
		isNavigationArrowsDisabled,
		shouldLettersOnAnswersBeDisplayed,
		shouldQuestionsNumbersBeDisplayed,
		animationDirection,
	} = useSelect((select) => {
		return {
			isProgressBarDisabled: select(
				'quillForms/settings-editor'
			).isProgressBarDisabled(),
			isWheelSwipingDisabled: select(
				'quillForms/settings-editor'
			).isWheelSwipingDisabled(),
			isNavigationArrowsDisabled: select(
				'quillForms/settings-editor'
			).isNavigationArrowsDisabled(),
			animationDirection: select(
				'quillForms/settings-editor'
			).getAnimationDirection(),
			shouldLettersOnAnswersBeDisplayed: select(
				'quillForms/settings-editor'
			).shouldLettersOnAnswersBeDisplayed(),
			shouldQuestionsNumbersBeDisplayed: select(
				'quillForms/settings-editor'
			).shouldQuestionsNumbersBeDisplayed()
		};
	});

	const animationOptions = [
		{
			key: 'horizontal',
			name: 'Horizontal',
		},
		{
			key: 'vertical',
			name: 'Vertical',
		},
	];
	return (
		<div className="settings-editor-panel-render">
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Hide progress bar'} />
					<ToggleControl
						checked={isProgressBarDisabled}
						onChange={() =>
							disableProgressBar(!isProgressBarDisabled)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Disable swiping by wheel'} />
					<ToggleControl
						checked={isWheelSwipingDisabled}
						onChange={() =>
							disableWheelSwiping(!isWheelSwipingDisabled)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Letters on answers'} isNew />
					<ToggleControl
						checked={shouldLettersOnAnswersBeDisplayed}
						onChange={() =>
							showLettersOnAnswers(
								!shouldLettersOnAnswersBeDisplayed
							)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Questions numbers'} isNew />
					<ToggleControl
						checked={shouldQuestionsNumbersBeDisplayed}
						onChange={() =>
							showQuestionsNumbers(
								!shouldQuestionsNumbersBeDisplayed
							)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Hide navigation arrows'} />
					<ToggleControl
						checked={isNavigationArrowsDisabled}
						onChange={() =>
							disableNavigationArrows(
								!isNavigationArrowsDisabled
							)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Animation direction'} />
					<SelectControl
						className={css`
							margin-top: 5px;
						` }
						onChange={({ selectedItem }) => {
							changeAnimationDirection(selectedItem.key);
						}}
						options={animationOptions}
						value={animationOptions.find(
							(option) => option.key === animationDirection
						)}
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};
export default PanelRender;

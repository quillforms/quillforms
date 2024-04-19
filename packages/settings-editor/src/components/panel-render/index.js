/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	SelectControl,
	__experimentalFeatureAvailability
} from '@quillforms/admin-components';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { Modal } from "@wordpress/components";
import { useState } from "@wordpress/element";
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from "classnames";

const PanelRender = () => {


	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');
	const {
		disableProgressBar,
		disableWheelSwiping,
		disableNavigationArrows,
		changeAnimationDirection,
		showLettersOnAnswers,
		showQuestionsNumbers,
		saveAnswersInBrowser,
		displayBranding,
	} = useDispatch('quillForms/settings-editor');

	const {
		isProgressBarDisabled,
		isWheelSwipingDisabled,
		isNavigationArrowsDisabled,
		shouldLettersOnAnswersBeDisplayed,
		shouldQuestionsNumbersBeDisplayed,
		shouldAnswersBeSavedInBrowser,
		shouldBrandingBeDisplayed,
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
			).shouldQuestionsNumbersBeDisplayed(),
			shouldAnswersBeSavedInBrowser: select(
				'quillForms/settings-editor'
			).shouldAnswersBeSavedInBrowser(),
			shouldBrandingBeDisplayed: select(
				'quillForms/settings-editor'
			).shouldBrandingBeDisplayed()
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
					<ControlLabel label={'Auto save progress (save answers in user browser)'} isNew />
					<ToggleControl
						checked={shouldAnswersBeSavedInBrowser}
						onChange={() =>
							saveAnswersInBrowser(!shouldAnswersBeSavedInBrowser)
						}
					/>
					<p className={css`
					    background: antiquewhite;
						padding: 10px;
						margin-top: 16px;
					`}>This feature will save the answers in the user's browser, so the user can continue the form later in same browser.
						To allow user to save and continue later from any device, you have to use <a href="" onClick={e => {
							e.preventDefault();
							setCurrentPanel('save-and-continue')
						}}>
							save and continue feature</a></p>
				</ControlWrapper>
			</BaseControl>
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
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={'Display Branding'} />
					<ToggleControl
						checked={shouldBrandingBeDisplayed}
						onChange={() => {
							displayBranding(!shouldBrandingBeDisplayed);
						}}
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};
export default PanelRender;

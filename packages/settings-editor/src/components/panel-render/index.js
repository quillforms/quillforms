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
import { __ } from '@wordpress/i18n';

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
		disableAstreisksOnRequiredFields,
		enableAutoSubmit,
		setNavigationType
	} = useDispatch('quillForms/settings-editor');

	const {
		isProgressBarDisabled,
		isWheelSwipingDisabled,
		isNavigationArrowsDisabled,
		shouldLettersOnAnswersBeDisplayed,
		shouldQuestionsNumbersBeDisplayed,
		shouldAnswersBeSavedInBrowser,
		shouldAstreisksOnRequiredFieldsBeHidden,
		shouldBrandingBeDisplayed,
		animationDirection,
		shouldAutoSubmitBeEnabled,
		navigationType
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
			).shouldBrandingBeDisplayed(),
			shouldAstreisksOnRequiredFieldsBeHidden: select(
				'quillForms/settings-editor'
			).shouldAstreisksOnRequiredFieldsBeHidden(),
			shouldAutoSubmitBeEnabled: select(
				'quillForms/settings-editor'
			).shouldAutoSubmitBeEnabled(),
			navigationType: select(
				'quillForms/settings-editor'
			).getNavigationType(),
		};
	});

	const animationOptions = [
		{
			key: 'horizontal',
			name: __('Horizontal', 'quillforms'),
		},
		{
			key: 'vertical',
			name: __('Vertical', 'quillforms'),
		},
	];
	const navigationOptions = [
		{
			key: 'arrows',
			name: __('Arrows', 'quillforms'),
		},
		{
			key: 'buttons',
			name: __('Buttons', 'quillforms'),
		},
	];
	return (
		<div className="settings-editor-panel-render">
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={__('Auto save progress (save answers in user browser)', 'quillforms')} />
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
						`}>{__('This feature will save the answers in the user\'s browser, so the user can continue the form later in same browser. To allow user to save and continue later from any device, you have to use', 'quillforms')} <a href="" onClick={e => {
							e.preventDefault();
							setCurrentPanel('save-and-continue')
						}}>
							{__('save and continue feature', 'quillforms')}</a></p>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={__('Hide progress bar', 'quillforms')} />
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
					<ControlLabel label={__('Disable swiping by wheel', 'quillforms')} />
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
					<ControlLabel label={__('Letters on answers', 'quillforms')} />
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
					<ControlLabel label={__('Questions numbers', 'quillforms')} />
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
					<ControlLabel label={__('Hide navigation arrows', 'quillforms')} />
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
					<ControlLabel label={__('Hide asterisks on required fields', 'quillforms')} />
					<ToggleControl
						checked={shouldAstreisksOnRequiredFieldsBeHidden}
						onChange={() =>
							disableAstreisksOnRequiredFields(
								!shouldAstreisksOnRequiredFieldsBeHidden
							)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={__('Animation direction', 'quillforms')} />
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
					<ControlLabel isNew label={__('Auto Submit the form after answering the last question', 'quillforms')} />
					<ToggleControl
						checked={shouldAutoSubmitBeEnabled}
						onChange={() => {
							enableAutoSubmit(!shouldAutoSubmitBeEnabled);
						}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel label={__('Display Branding', 'quillforms')} />
					<ToggleControl
						checked={shouldBrandingBeDisplayed}
						onChange={() => {
							displayBranding(!shouldBrandingBeDisplayed);
						}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper>
					<ControlLabel isNew label={__('Navigation type', 'quillforms')} />
					<SelectControl
						options={navigationOptions}
						value={navigationOptions.find(
							(option) => option.key === navigationType
						)}
						onChange={({ selectedItem }) => {
							setNavigationType(selectedItem.key);
						}}
					/>
				</ControlWrapper>
			</BaseControl>
		</div>
	);
};
export default PanelRender;

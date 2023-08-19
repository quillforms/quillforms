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

	const [displayProModal, setDisplayProModal] = useState(false);
	const license = ConfigAPI.getLicense();

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
							if (license?.status !== 'valid') {
								setDisplayProModal(true);
							}
							else {
								displayBranding(!shouldBrandingBeDisplayed);
							}
						}}
					/>
				</ControlWrapper>
			</BaseControl>

			<>
				{displayProModal && (
					<Modal
						className={classnames(
							css`
										border: none !important;
										border-radius: 9px;

										.components-modal__header {
											background: linear-gradient(
												42deg,
												rgb( 235 54 221 ),
												rgb( 238 142 22 )
											);
											h1 {
												color: #fff;
											}
											svg {
												fill: #fff;
											}
										}
										.components-modal__content {
											text-align: center;
										}
									`
						)}
						title="Remove QuillForms Branding"
						onRequestClose={() => {
							setDisplayProModal(false);
						}}
					>
						<__experimentalFeatureAvailability
							featureName="Remove QuillForms Branding"
							planKey="basic"
							showLockIcon={true}
						/>
					</Modal>
				)}
			</>
		</div >
	);
};
export default PanelRender;

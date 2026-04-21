/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	SelectControl,
	Button,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const panelStyle = css`
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding-bottom: 12px;

	.admin-components-base-control {
		margin: 0 !important;
		padding: 0 !important;
		border: 0 !important;
		background: transparent !important;
	}

	.admin-components-control-wrapper {
		display: flex !important;
		align-items: center !important;
		justify-content: space-between !important;
		flex-wrap: wrap !important;
		gap: 12px !important;
		background: #f7f8fa !important;
		border: 1px solid #d9d9d9 !important;
		border-radius: 10px !important;
		padding: 12px 14px !important;
	}

	/* Match label scale: compact selects next to 13px labels */
	.admin-components-select-control .components-custom-select-control__button,
	.combobox-control .components-custom-select-control__button {
		min-height: 36px !important;
		padding: 8px 12px !important;
		font-size: 13px !important;
		line-height: 1.35 !important;
		border-radius: 8px !important;
	}

	/* Do not set .admin-components-control-label here — labelStyle on ControlLabel must win */
`;

const stickyFooterStyle = css`
	position: sticky;
	bottom: 0;
	z-index: 5;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 24px;
	margin-top: 8px;
	padding: 16px 0 16px;
	background: #fff;

`;

const cancelBtnStyle = css`
	border: 1px solid #b2328c !important;
	color: #b2328c !important;
	background: #fff !important;
	border-radius: 10px !important;
	padding: 8px 16px !important;
	height: 38px !important;
	min-height: 38px !important;
	font-size: 14px !important;
	font-weight: 500 !important;
	line-height: 1.4 !important;
`;

const saveBtnStyle = css`
	border: 1px solid #b2328c !important;
	color: #fff !important;
	background: #b2328c !important;
	border-radius: 10px !important;
	padding: 8px 16px !important;
	height: 38px !important;
	min-height: 38px !important;
	font-size: 14px !important;
	font-weight: 500 !important;
	line-height: 1.4 !important;
`;

const baseControlStyle = css`
	margin: 0 !important;
	padding: 0 !important;
	border: 0 !important;
`;

const cardStyle = css`
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 12px;
	background: #fff;
	border: 1px solid #e2e8f0;
	border-radius: 10px;
	padding: 12px 14px;
`;

const labelStyle = css`
	margin: 0 !important;
	color: #334155 !important;
	font-size: 13px !important;
	font-weight: 500 !important;
	line-height: 1.35 !important;
	max-width: min(420px, 72%) !important;
`;

const selectStyle = css`
	min-width: 170px;
`;

const infoBoxStyle = css`
	width: 100%;
	flex-basis: 100%;
	margin-top: 0;
	padding: 10px 12px;
	border-radius: 8px;
	background: #dae5f0;
	color: #334155;
	font-size: 13px;
	font-weight: 400;
	line-height: 1.45;

	a {
		color: #b2328c;
		font-size: inherit;
		line-height: inherit;
		font-weight: 500;
		text-decoration: underline;
	}
`;

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
		<div className={panelStyle}>
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Auto save progress (save answers in user browser)', 'quillforms')} />
					<ToggleControl
						checked={shouldAnswersBeSavedInBrowser}
						onChange={() =>
							saveAnswersInBrowser(!shouldAnswersBeSavedInBrowser)
						}
					/>
					<p className={infoBoxStyle}>{__('This feature will save the answers in the user\'s browser, so the user can continue the form later in same browser. To allow user to save and continue later from any device, you have to use', 'quillforms')} <a href="" onClick={e => {
						e.preventDefault();
						setCurrentPanel('save-and-continue')
					}}>
						{__('save and continue feature', 'quillforms')}</a></p>
				</ControlWrapper>
			</BaseControl>
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Hide progress bar', 'quillforms')} />
					<ToggleControl
						checked={isProgressBarDisabled}
						onChange={() =>
							disableProgressBar(!isProgressBarDisabled)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Disable swiping by wheel', 'quillforms')} />
					<ToggleControl
						checked={isWheelSwipingDisabled}
						onChange={() =>
							disableWheelSwiping(!isWheelSwipingDisabled)
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Letters on answers', 'quillforms')} />
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
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Questions numbers', 'quillforms')} />
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
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Hide navigation arrows', 'quillforms')} />
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
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Hide asterisks on required fields', 'quillforms')} />
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
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Animation direction', 'quillforms')} />
					<SelectControl
						className={selectStyle}
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
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} isNew label={__('Auto Submit the form after answering the last question', 'quillforms')} />
					<ToggleControl
						checked={shouldAutoSubmitBeEnabled}
						onChange={() => {
							enableAutoSubmit(!shouldAutoSubmitBeEnabled);
						}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} label={__('Display Branding', 'quillforms')} />
					<ToggleControl
						checked={shouldBrandingBeDisplayed}
						onChange={() => {
							displayBranding(!shouldBrandingBeDisplayed);
						}}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl className={baseControlStyle}>
				<ControlWrapper className={cardStyle}>
					<ControlLabel className={labelStyle} isNew label={__('Navigation type', 'quillforms')} />
					<SelectControl
						className={selectStyle}
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
			<div className={stickyFooterStyle}>
				<Button
					isDefault
					className={cancelBtnStyle}
					onClick={() => setCurrentPanel('')}
				>
					{__('Cancel', 'quillforms')}
				</Button>
				<Button
					isPrimary
					className={saveBtnStyle}
					onClick={() => setCurrentPanel('')}
				>
					{__('Save', 'quillforms')}
				</Button>
			</div>
		</div>
	);
};
export default PanelRender;

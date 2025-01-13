/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	Button,
	SelectControl,
} from '@quillforms/admin-components';

// @ts-expect-error.
import { ThemeCard, ThemeListItem } from '@quillforms/theme-editor';

/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from 'react';
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const BlockThemeControl = ({ blockTheme, setAttributes }) => {
	const [showThemeModal, setShowThemeModal] = useState(false);
	const [inherit, setInherit] = useState(blockTheme ? false : true);

	useEffect(() => {
		if (blockTheme) {
			setInherit(false);
		} else {
			setInherit(true);
		}
	}, [blockTheme]);
	const { themesList } = useSelect((select) => {
		return {
			// @ts-expect-error
			themesList: select('quillForms/theme-editor').getThemesList(),
		};
	});
	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');
	const themeOptions = [
		{
			key: 'inherit',
			name: __('Inherit', 'quillforms'),
		},
		{
			key: 'override',
			name: __('Override', 'quillforms'),
		},
	];
	return (
		<>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label={__('Theme', 'quillforms')}></ControlLabel>
					<SelectControl
						label=""
						className={css`
							margin-top: 5px;
						` }
						onChange={({ selectedItem }) => {
							if (selectedItem?.key === 'inherit') {
								setAttributes({
									themeId: undefined,
								});
								setInherit(true);
							} else {
								setInherit(false);
							}
						}}
						options={themeOptions}
						value={themeOptions.find(
							(option) =>
								option.key ===
								(inherit === true ? 'inherit' : 'override')
						)}
					/>
				</ControlWrapper>
				{!inherit && (
					<ControlWrapper orientation="horizontal">
						<ControlLabel label={__('Select theme', 'quillforms')}></ControlLabel>
						{themesList?.length === 0 ? (
							<Button
								isSecondary
								isButton
								isDefault
								onClick={() => {
									setCurrentPanel('theme');
								}}
							>
								{__('Create a theme first!', 'quillforms')}
							</Button>
						) : (
							<Button
								isPrimary
								isButton
								isDefault
								onClick={() => {
									setShowThemeModal(true);
								}}
							>
								{__('Select a theme', 'quillforms')}
							</Button>
						)}
					</ControlWrapper>
				)}
			</BaseControl>
			{showThemeModal && (
				<Modal
					className={classnames(
						'block-editor-block-theme-modal',
						css`
							border: none !important;
							min-width: 500px !important;
							border-radius: 10px;
							z-index: 1111111;

							.components-modal__content {
								background: #eee;
							}

							.components-modal__header {
								background: #a120f1;
								.components-modal__header-heading {
									color: #fff;
								}
								.components-button.has-icon svg {
									fill: #fff;
								}
							}
						`
					)}
					// Because focus on editor is causing the click handler to be triggered
					shouldCloseOnClickOutside={false}
					title={__('Select a theme!', 'quillforms')}
					onRequestClose={() => {
						setShowThemeModal(false);
					}}
				>
					<div className="theme-editor-themes-list">
						{themesList.map((theme, index) => {
							return (
								<ThemeCard
									index={index}
									key={theme.id}
									isSelected={theme.id === blockTheme}
								>
									<ThemeListItem
										theme={theme}
										onClick={() => {
											setAttributes({
												themeId: theme.id,
											});
										}}
									/>
								</ThemeCard>
							);
						})}
					</div>
				</Modal>
			)}
		</>
	);
};
export default BlockThemeControl;

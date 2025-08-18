/**
 * QuillForms Dependencies
 */
import {
	Button,
	HTMLParser,
	useBlockTheme,
	useMessages,
	useFormContext,
} from '@quillforms/renderer-core';
/**
 * WordPress Dependencies
 */
import { useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { noop } from 'lodash';
import { css } from 'emotion';
import classNames from 'classnames';
import { useMediaQuery } from "@uidotdev/usehooks";
import Attachment from './attachment';

// Add this function at the top of your component, before the WelcomeScreenOutput component
const getAlignmentStyles = (align) => {
	switch (align) {
		case 'left':
			return {
				textAlign: 'left',
				alignItems: 'flex-start',
			};
		case 'right':
			return {
				textAlign: 'right',
				alignItems: 'flex-end',
			};
		case 'center':
		default:
			return {
				textAlign: 'center',
				alignItems: 'center',
			};
	}
};

const WelcomeScreenOutput = ({ attributes }) => {
	const { isPreview, deviceWidth, editor } = useFormContext();

	const [isActive, setIsActive] = useState(false);
	const [stickyFooter, setStickyFooter] = useState(false);
	const theme = useBlockTheme(attributes.themeId);
	const screenWrapperRef = useRef();
	const screenContentRef = useRef();
	const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");
	const layout = isSmallDevice ? 'stack' : attributes?.layout ?? 'stack';

	// Get alignment value from attributes
	const align = attributes?.align ?? 'center';
	const alignmentStyles = getAlignmentStyles(align);

	const { goToBlock } = useDispatch('quillForms/renderer-core');
	const { walkPath } = useSelect((select) => {
		return {
			walkPath: select('quillForms/renderer-core').getWalkPath(),
		};
	});

	useEffect(() => {
		setIsActive(true);
		return () => setIsActive(false);
	}, []);

	let next = noop;
	if (walkPath[0] && walkPath[0].id && editor.mode === 'off') {
		next = () => goToBlock(walkPath[0].id);
	}

	return (
		<div
			className={css`
				height: 100%;
				position: relative;
				outline: none;
			`}
			ref={screenWrapperRef}
			tabIndex="0"
			onKeyDown={(e) => {
				if (e.key === 'Enter') {
					e.stopPropagation();
					next();
				}
			}}
		>
			<div
				className={classNames(
					'qf-welcome-screen-block__wrapper',
					`blocktype-welcome-screen-block`,
					`renderer-core-block-${attributes?.layout}-layout`,
					{
						'with-sticky-footer': stickyFooter,
						active: isActive,
					},
					css`
						& {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 6;
							display: flex;
							${layout === 'stack' &&
						`flex-direction: column;
							.qf-welcome-screen-block__content-wrapper {
								position: absolute;
								top: 0;
								right: 0;
								left: 0;
							}`}
							justify-content: center;
							width: 100%;
							height: 100%;
							overflow-y: auto;
							opacity: 0;
							visibility: hidden;
							transition: all 0.4s ease-in-out;
							-webkit-transition: all 0.4s ease-in-out;
							-moz-transition: all 0.4s ease-in-out;
						}

						&.active {
							opacity: 1;
							visibility: visible;
						}

						.qf-welcome-screen-block__content-wrapper {
							display: flex;
							flex-direction: column;
							justify-content: center;
							/* Apply alignment styles */
							align-items: ${alignmentStyles.alignItems};
							text-align: ${alignmentStyles.textAlign};
							max-width: 700px;
							padding: 30px;
							word-wrap: break-word;
							margin-right: auto;
							margin-left: auto;
							min-height: 100%;
						}
					`
				)}
			>
				<div className={'qf-welcome-screen-block__content-wrapper'}>
					<div
						className="qf-welcome-screen-block__content"
						ref={screenContentRef}
					>
						{layout === 'stack' && (
							<Attachment
								isPreview={isPreview}
								attributes={attributes}
							/>
						)}
						<div
							className={css`
								margin-top: 25px;
								/* Ensure content follows the alignment too */
								text-align: inherit;
							`}
						>
							{(attributes?.label || editor.mode === 'on') && (
								<div
									className={classNames(
										'renderer-components-block-label',
										css`
											color: ${theme.questionsColor};
											font-family: ${theme.questionsLabelFont};
											/* Inherit text alignment */
											text-align: inherit;
											@media ( min-width: 768px ) {
												font-size: ${theme
												.questionsLabelFontSize
												.lg} !important;
												line-height: ${theme
												.questionsLabelLineHeight
												.lg} !important;
											}
											@media ( max-width: 767px ) {
												font-size: ${theme
												.questionsLabelFontSize
												.sm} !important;
												line-height: ${theme
												.questionsLabelLineHeight
												.sm} !important;
											}
										`
									)}
								>
									{editor?.mode === 'on' ? <editor.editLabel /> : <HTMLParser value={attributes?.label ?? ''} />}
								</div>
							)}
							{((attributes?.description &&
								attributes.description !== '') || editor.mode === 'on') && (
									<div
										className={classNames(
											'renderer-components-block-description',
											css`
												color: ${theme.questionsColor};
												font-family: ${theme.questionsDescriptionFont};
												/* Inherit text alignment */
												text-align: inherit;
												@media ( min-width: 768px ) {
													font-size: ${theme
													.questionsDescriptionFontSize
													.lg} !important;
													line-height: ${theme
													.questionsDescriptionLineHeight
													.lg} !important;
												}
												@media ( max-width: 767px ) {
													font-size: ${theme
													.questionsDescriptionFontSize
													.sm} !important;
													line-height: ${theme
													.questionsDescriptionLineHeight
													.sm} !important;
												}
											`
										)}
									>
										{editor?.mode === 'on' ? <editor.editDescription /> : <HTMLParser value={attributes.description ?? ''} />}
									</div>
								)}
							{attributes.customHTML && (
								<div
									className={classNames(
										'renderer-components-block-custom-html',
										css`
											color: ${theme.questionsColor};
											/* Inherit text alignment */
											text-align: inherit;
										`
									)}
									dangerouslySetInnerHTML={{
										__html: attributes?.customHTML,
									}}
								></div>
							)}
						</div>
						<ScreenAction
							theme={theme}
							next={next}
							isSticky={stickyFooter}
							buttonText={attributes.buttonText}
							align={align} // Pass alignment to ScreenAction
						/>
					</div>
				</div>
				{layout !== 'stack' && (
					<div
						className={classNames(
							'renderer-core-block-attachment-wrapper',
							css`
								img {
									object-position: ${
								// @ts-expect-error
								attributes?.attachmentFocalPoint
									?.x * 100
								}%
										${
								// @ts-expect-error
								attributes?.attachmentFocalPoint
									?.y * 100
								}%;
								}
							`
						)}
					>
						<Attachment
							isPreview={isPreview}
							attributes={attributes}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

// Updated ScreenAction component to support alignment
const ScreenAction = ({ isSticky, buttonText, next, theme, align = 'center' }) => {
	const messages = useMessages();
	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0;

	const getActionAlignment = (align) => {
		switch (align) {
			case 'left':
				return 'flex-start';
			case 'right':
				return 'flex-end';
			case 'center':
			default:
				return 'center';
		}
	};

	return (
		<div
			className={classNames(
				'qf-welcome-screen-block__action-wrapper',
				{
					'is-sticky': isSticky,
				},
				css`
					& {
						display: flex;
						flex-direction: column;
						justify-content: ${getActionAlignment(align)};
						align-items: ${getActionAlignment(align)};
						margin-top: 20px;
						text-align: ${align};
					}
				`
			)}
		>
			<div className="qf-welcome-screen-block__action">
				<Button theme={theme} onClick={next}>
					{buttonText}
				</Button>
			</div>

			<div
				className={classNames(
					'qf-welcome-screen-block__action-helper-text',
					css`
						color: ${theme.questionsColor};
						font-size: 12px;
						margin-top: 8px;
						text-align: ${align};
					`
				)}
			>
				{!isTouchScreen && (
					<HTMLParser value={messages['label.hintText.enter']} />
				)}
			</div>
		</div>
	);
};

export default WelcomeScreenOutput;

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
import Attachment from './attachment';

const WelcomeScreenOutput = ({ attributes }) => {
	const { isPreview, deviceWidth } = useFormContext();
	const [isActive, setIsActive] = useState(false);
	const [stickyFooter, setStickyFooter] = useState(false);
	const theme = useBlockTheme(attributes.themeId);
	const screenWrapperRef = useRef();
	const screenContentRef = useRef();

	const { goToBlock } = useDispatch('quillForms/renderer-core');
	const { walkPath } = useSelect((select) => {
		return {
			walkPath: select('quillForms/renderer-core').getWalkPath(),
		};
	});
	// useLayoutEffect( () => {
	// 	if (
	// 		screenContentRef.current.clientHeight + 150 >
	// 		screenWrapperRef.current.clientHeight
	// 	) {
	// 		setStickyFooter( true );
	// 	} else {
	// 		setStickyFooter( false );
	// 	}
	// } );

	useEffect(() => {
		setIsActive(true);

		return () => setIsActive(false);
	}, []);
	let next = noop;

	if (walkPath[0] && walkPath[0].id) {
		next = () => goToBlock(walkPath[0].id);
	}

	return (
		<div
			className={css`
				height: 100%;
				position: relative;
				outline: none;
			` }
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
							${(attributes.layout === 'stack' ||
							(deviceWidth === 'mobile' &&
								(attributes.layout === 'float-left' ||
									attributes.layout ===
									'float-right'))) &&
						`flex-direction: column;
							.qf-welcome-screen-block__content-wrapper {

								position: absolute;
								top: 0;
								right: 0;
								left: 0;
							}` }
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
						// &.with-sticky-footer {
						// 	display: block;
						// 	.qf-welcome-screen-block__content-wrapper {
						// 		height: calc(100% - 70px);

						// 	}
						// }
						.qf-welcome-screen-block__content-wrapper {
							display: flex;
							flex-direction: column;
							justify-content: center;
							max-width: 700px;
							padding: 30px;
							word-wrap: break-word;
							text-align: center;
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
						{(attributes.layout === 'stack' ||
							(deviceWidth === 'mobile' &&
								(attributes.layout === 'float-left' ||
									attributes.layout ===
									'float-right'))) && (
								<Attachment
									isPreview={isPreview}
									attributes={attributes}
								/>
							)}
						<div
							className={css`
								margin-top: 25px;
							` }
						>
							{attributes?.label && (
								<div
									className={classNames(
										'renderer-components-block-label',
										css`
										color: ${theme.questionsColor};
										font-family: ${theme.questionsLabelFont};
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
									<HTMLParser value={attributes.label} />
								</div>
							)}
							{attributes?.description &&
								attributes.description !== '' && (
									<div
										className={classNames(
											'renderer-components-block-description',
											css`
												color: ${theme.questionsColor};
												font-family: ${theme.questionsDescriptionFont};
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
										<HTMLParser
											value={attributes.description}
										/>
									</div>
								)}
							{attributes.customHTML && (
								<div
									className={classNames(
										'renderer-components-block-custom-html',
										css`
											color: ${theme.questionsColor};
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
						/>
					</div>
				</div>
				{((attributes.layout !== 'stack' &&
					deviceWidth !== 'mobile') ||
					(deviceWidth === 'mobile' &&
						(attributes.layout === 'split-left' ||
							attributes.layout === 'split-right'))) && (
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
const ScreenAction = ({ isSticky, buttonText, next, theme }) => {
	const messages = useMessages();
	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0;

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
						justify-content: center;
						align-items: center;
						margin-top: 20px;
					}
					// &.is-sticky {
					// 	position: absolute;
					// 	bottom: 0;
					// 	right: 0;
					// 	left: 0;
					// 	width: 100%;
					// 	background-color: rgba(0, 0, 0, 0.05);
					// 	box-shadow: rgba(0, 0, 0, 0.1) 0 -1px;
					// 	height: 70px;
					// 	display: flex;
					// 	align-items: center;
					// 	justify-content: center;

					// 	.qf-welcome-screen-block__action {
					// 		margin: 0 auto;
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

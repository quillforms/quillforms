/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';
import { useState, useMemo, useRef, useEffect } from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import tinycolor from 'tinycolor2';


/**
 * Internal Dependencies
 */
import Button from '../button';
import HTMLParser from '../html-parser';
import { __experimentalUseFieldRenderContext } from '../field-render';
import useBlockTypes from '../../hooks/use-block-types';
import useMessages from '../../hooks/use-messages';
import useBlockTheme from '../../hooks/use-block-theme';
import { useFormContext } from '../../hooks';


const FieldAction = ({ clickHandler, show }) => {
	const messages = useMessages();
	const fieldRenderContext = __experimentalUseFieldRenderContext();
	const { editor } = useFormContext()
	const blockTypes = useBlockTypes();

	if (!fieldRenderContext || !messages || !blockTypes) {
		return null;
	}

	const { blockName, isSubmitBtnVisible, attributes, } = fieldRenderContext;
	const theme = useBlockTheme(attributes?.themeId);
	const [isSticky, setIsSticky] = useState(false);
	const [hasInitialized, setHasInitialized] = useState(false);

	if (!blockName) return null;

	const blockType = blockTypes[blockName];
	const isVisible = isSubmitBtnVisible || show;

	// Handle visibility change
	const handleVisibilityChange = (isInView) => {
		if (!hasInitialized) {
			setHasInitialized(true);
		}
		setIsSticky(!isInView);
	};

	// Memoize touch detection
	const isTouchScreen = useMemo(() => {
		if (typeof window === 'undefined') return false;
		return (
			'ontouchstart' in window ||
			navigator.maxTouchPoints > 0 ||
			navigator.msMaxTouchPoints > 0
		);
	}, []);

	// Optimized sticky styles with hardware acceleration
	const stickyStyles = useMemo(() => {
		return css`
			position: fixed !important;
			bottom: 0 !important;
			left: 0 !important;
			right: 0 !important;
			width: 100% !important;
			background: ${tinycolor(theme?.backgroundColor)?.setAlpha(0.8)?.toString() || '#fff'} !important;
			box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15) !important;
			padding: 15px 20px !important;
			z-index: 1111111111111111111000 !important;
			margin-bottom: 0 !important;
			display: flex !important;
			justify-content: center !important;
			align-items: center !important;
			flex-direction: column !important;
			transform: translateZ(0) !important;
			will-change: transform !important;
			backface-visibility: hidden !important;
			
			/* Smooth entrance animation */
			animation: slideUpSticky 0.2s ease-out !important;

			@keyframes slideUpSticky {
				from {
					transform: translateY(100%) translateZ(0) !important;
					opacity: 0;
				}
				to {
					transform: translateY(0) translateZ(0) !important;
					opacity: 1;
				}
			}
		`;
	}, [theme?.buttonsBgColor]);

	// Memoize the content to prevent unnecessary re-renders
	const renderContent = useMemo(() => {
		if (blockType?.nextBtn) {
			const NextBtnComponent = blockType.nextBtn;
			return <NextBtnComponent onClick={clickHandler} />;
		}

		const buttonLabel =
			typeof attributes?.nextBtnLabel === 'string'
				? attributes.nextBtnLabel
				: messages?.['label.button.ok'] || 'OK';

		const hintText = messages?.['label.hintText.enter'] || 'Press Enter';

		return (
			<>
				<Button theme={theme} onClick={clickHandler}>
					<HTMLParser value={buttonLabel} />
				</Button>
				{!isTouchScreen && (
					<div
						className={css`
							color: ${theme?.questionsColor || '#666'};
							font-size: 15px;
							margin-top: 8px;
							text-align: center;
						`}
					>
						<HTMLParser value={hintText} />
					</div>
				)}
			</>
		);
	}, [blockType, clickHandler, attributes?.nextBtnLabel, messages, theme, isTouchScreen]);

	if (!isVisible) {
		return null;
	}

	return (
		<>
			{/* Original container with visibility sensor */}
			<VisibilitySensor
				active={editor?.mode !== 'on'}
				onChange={handleVisibilityChange}
				throttleInterval={50} // Reduced throttle for better responsiveness
				partialVisibility={false}
				offset={{ bottom: 50 }} // Trigger a bit earlier
			>
				<div
					className={classnames(
						'renderer-core-field-action',
						{
							'is-visible': !isSticky,
						}
					)}
				>
					{/* Always render content in original position, hide when sticky */}
					<div style={{ opacity: isSticky ? 0 : 1 }}>
						{renderContent}
					</div>
				</div>
			</VisibilitySensor>

			{/* Sticky version - only show when sticky */}
			{isSticky && (
				<div
					className={stickyStyles}
					role="toolbar"
					aria-label="Form actions"
				>
					{renderContent}
				</div>
			)}
		</>
	);
};

export default FieldAction;
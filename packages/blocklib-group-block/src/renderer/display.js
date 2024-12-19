/**
 * QuillForms Dependencies
 */
import {
	useBlockTheme,
	HTMLParser,
	__experimentalUseFieldRenderContext,
	FieldRenderContextProvider,
	ErrMsg,
	useFormSettings,
	useFormContext
} from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from 'react';

/**
 * External Dependencies
 */
import { noop, size } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import zenScroll from './zen-scroll';

const GroupDisplay = ({ id, innerBlocks, isTouchScreen, ...props }) => {
	const { isErrMsgVisible, isActive } = __experimentalUseFieldRenderContext();
	const { editor } = useFormContext();
	const formSettings = useFormSettings();
	// By Default, the focus will be on the first item on the group.
	const [refIndex, setRefIndex] = useState(0);
	const { blockTypes, answers, isAnimating } = useSelect((select) => {
		return {
			isAnimating: select('quillForms/renderer-core').isAnimating(),
			blockTypes: select('quillForms/blocks').getBlockTypes(),
			answers: select('quillForms/renderer-core').getAnswers(),
		};
	});
	let refAssigned = false;

	const theme = useBlockTheme(props.attributes.themeId);
	const {
		setIsFieldValid,
		setFieldValidationErr,
		setIsFieldAnswered,
		setIsFieldPending,
		setFieldPendingMsg,
		setFieldAnswer,
	} = useDispatch('quillForms/renderer-core');

	useEffect(() => {
		if (isErrMsgVisible && editor.mode === 'off') {
			let firstInvalidBlock = null;
			if (size(innerBlocks) > 0) {
				innerBlocks.forEach((block, index) => {
					if (!answers[block.id]?.isValid) {
						if (!firstInvalidBlock) {
							setRefIndex(index);
							firstInvalidBlock = block;
							return false;
						}
					}
				});
			}

			if (firstInvalidBlock && isActive) {
				const defaultDuration = 500;
				const edgeOffset = 30;
				const myDiv = document.querySelector(
					`#block-${id} .renderer-core-block-scroller`
				);
				const myScroller = zenScroll.createScroller(
					myDiv,
					defaultDuration,
					edgeOffset
				);
				const target = document.getElementById(
					`renderer-core-child-block-${firstInvalidBlock.id}`
				);
				myScroller.center(target);

				if (
					[
						'short-text',
						'long-text',
						'email',
						'phone',
						'dropdown',
						'number',
						'date',
						'website',
					].includes(firstInvalidBlock.name) &&
					!isAnimating &&
					!isTouchScreen
				) {
					setTimeout(() => {
						props?.inputRef?.current?.focus();
					}, 0);
				}
			}
		}
	}, [isErrMsgVisible, isActive, isAnimating]);
	return (
		<div className={classnames("renderer-core-group-children-wrapper", css`
			display: flex;
			flex-wrap: wrap;
			margin-right: -20px; 

		`)}>
			{size(innerBlocks) > 0 &&
				innerBlocks.map((block, index) => {
					const blockType = blockTypes[block.name];
					let blockLabel = block?.attributes?.label ?? '';
					if (block?.attributes?.required && !formSettings.disableAstreisksOnRequiredFields)
						blockLabel = blockLabel + ' *';
					const blockProps = {
						...props,
						isTouchScreen,
						inputRef:
							refAssigned && refIndex !== index
								? null
								: props.inputRef,
						id: block.id,
						next: noop,
						attributes: block.attributes,
						innerBlocks,
						val: answers?.[block.id]?.value,
						setIsValid: (val) => setIsFieldValid(block.id, val),
						setIsAnswered: (val) =>
							setIsFieldAnswered(block.id, val),
						setIsPending: (val) =>
							setIsFieldPending(block.id, val),
						setPendingMsg: (val) =>
							setFieldPendingMsg(block.id, val),
						setValidationErr: (val) =>
							setFieldValidationErr(block.id, val),
						setVal: (val) => setFieldAnswer(block.id, val),
						showNextBtn: noop,
						showErrMsg: noop,
					};
					const context = {
						id,
						blockName: block.name,
						attributes: block.attributes,
					};

					refAssigned = true;
					const isFullWidth = block.attributes?.width === '100%' || !block.attributes?.width;

					return (
						<FieldRenderContextProvider
							key={block.id}
							value={context}
						>
							<div
								className={classnames(
									'renderer-core-child-block',
									`renderer-core-child-block-${block.id}`,
									editor.mode === 'on' &&
									editor.isChildActive(block.id) &&
									'renderer-core-child-block-editor-active',
									css`
										margin-bottom: 48px;
										&:last-child {
											margin-bottom: 0;
										}
										width: ${isFullWidth ? '100%' : `calc(${block.attributes.width} - 20px)`} !important;
										margin-right: 20px;
									`
								)}
								id={`renderer-core-child-block-${block.id}`}
								onClick={() => {
									console.log('clicked');
									if (editor.mode === 'on') editor.setIsChildActive(block.id);
								}}

								onFocus={() => {
									if (editor.mode === 'on') editor.setIsChildActive(block.id);
								}}


							>
								<div
									className={classnames(
										'renderer-components-child-block-label',
										css`
											color: ${theme.questionsColor} !important;
											font-family: ${theme.questionsLabelFont} !important;
											@media ( min-width: 768px ) {
												font-size: ${theme.fontSize
												.lg} !important;
												line-height: ${theme
												.fontLineHeight
												.lg} !important;
											}
											@media ( max-width: 767px ) {
												font-size: ${theme.fontSize
												.sm} !important;
												line-height: ${theme
												.fontLineHeight
												.sm} !important;
											}

											margin-bottom: 12px !important;
										`
									)}
								>
									{editor.mode === 'on' ? (
										<editor.editLabel childId={block.id} childIndex={index} parentId={id} />
									) : (
										<HTMLParser value={blockLabel} />
									)}
								</div>
								<>
									{blockType?.display && (
										/* @ts-expect-error */
										<blockType.display {...blockProps} />
									)}
								</>
								{isErrMsgVisible &&
									answers?.[block?.id]?.validationErr && (
										<div
											className={css`
												margin-top: 20px;
											` }
										>
											<ErrMsg
												message={
													answers[block.id]
														.validationErr
												}
											/>
										</div>
									)}
							</div>
						</FieldRenderContextProvider>
					);
				})}

		</div>
	);
};
export default GroupDisplay;
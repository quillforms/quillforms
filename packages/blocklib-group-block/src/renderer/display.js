/**
 * QuillForms Dependencies
 */
import {
	useMessages,
	useBlockTheme,
	HTMLParser,
} from '@quillforms/renderer-core';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { noop, size } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

const GroupDisplay = ( { innerBlocks, ...props } ) => {
	const { blockTypes, answers } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
			answers: select( 'quillForms/renderer-core' ).getAnswers(),
		};
	} );
	console.log( answers );
	console.log( innerBlocks );
	const theme = useBlockTheme( props.attributes.themeId );
	const {
		setIsFieldValid,
		setFieldValidationErr,
		setIsFieldAnswered,
		setIsFieldPending,
		setFieldPendingMsg,
		setFieldAnswer,
	} = useDispatch( 'quillForms/renderer-core' );
	return (
		<>
			{ size( innerBlocks ) > 0 &&
				innerBlocks.map( ( block ) => {
					const blockType = blockTypes[ block.name ];
					console.log( blockType );
					const blockProps = {
						id: block.id,
						next: noop,
						attributes: block.attributes,
						innerBlocks,
						val: answers?.[ block.id ]?.value,
						setIsValid: ( val ) => setIsFieldValid( block.id, val ),
						setIsAnswered: ( val ) =>
							setIsFieldAnswered( block.id, val ),
						setIsPending: ( val ) =>
							setIsFieldPending( block.id, val ),
						setPendingMsg: ( val ) =>
							setFieldPendingMsg( block.id, val ),
						setValidationErr: ( val ) =>
							setFieldValidationErr( block.id, val ),
						setVal: ( val ) => setFieldAnswer( block.id, val ),
						showNextBtn: noop,
						showErrMsg: noop,
					};
					return (
						<div
							key={ block.id }
							className={ css`
								margin-bottom: 48px;
							` }
						>
							<div
								className={ classnames(
									'renderer-components-inner-block-label',
									css`
										color: ${ theme.questionsColor } !important;
										font-family: ${ theme.questionsLabelFont } !important;
										@media ( min-width: 768px ) {
											font-size: ${ theme.fontSize
												.lg } !important;
											line-height: ${ theme.fontLineHeight
												.lg } !important;
										}
										@media ( max-width: 767px ) {
											font-size: ${ theme.fontSize
												.sm } !important;
											line-height: ${ theme.fontLineHeight
												.sm } !important;
										}

										margin-bottom: 12px !important;
									`
								) }
							>
								<HTMLParser
									value={ block?.attributes?.label }
								/>
							</div>
							{
								/* @ts-expect-error */
								<blockType.display { ...blockProps } />
							}
						</div>
					);
				} ) }
		</>
	);
};
export default GroupDisplay;

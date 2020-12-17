/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { Fragment, useState, useEffect, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * QuillForms Dependencies
 */
import {
	FieldsWrapper,
	FieldRender,
	FormFooter,
	useMetaField,
	useBlockTypes,
} from '@quillforms/renderer-components';
import { useTheme } from '@quillforms/utils';
/**
 * External Dependencies
 */
import { Lethargy } from 'lethargy';
import { cloneDeep, concat } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import SubmissionScreen from '../submission-screen';
import DefaultThankYouScreen from '../default-thankyou-screen';

let lastScrollDate = 0;
const lethargy = new Lethargy();
const FormContent = ( { applyJumpLogic } ) => {
	const blockTypes = useBlockTypes();
	const blocks = useMetaField( 'blocks' );
	const $blocks = concat( blocks, {
		id: 'default_thankyou_screen',
		type: 'thankyou-screen',
	} );
	const theme = useTheme();

	const { currentBlockBeingEdited } = useSelect( ( select ) => {
		return {
			currentBlockBeingEdited: select(
				'quillForms/block-editor'
			).getCurrentBlockId(),
		};
	} );

	const [ swiper, setSwiper ] = useState( {
		walkPath: [],
		currentBlockId: undefined,
		nextBlockId: undefined,
		lastActiveBlockId: undefined,
		prevBlockId: undefined,
		canGoNext: false,
		canGoPrev: false,
		isAnimating: true,
		disableTransition: false,
		isSubmissionScreenActive: undefined,
		isThankyouScreenActive: false,
		shouldLastActiveBlockBeRendered: true,
	} );

	const {
		walkPath,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		lastActiveBlockId,
		canGoNext,
		canGoPrev,
		isAnimating,
		disableTransition,
		isSubmissionScreenActive,
		isThankyouScreenActive,
		shouldLastActiveBlockBeRendered,
	} = swiper;

	console.log( swiper );
	const formFields = blocks.filter(
		( block ) =>
			block.type !== 'thankyou-screen' && block.type !== 'welcome-screen'
	);

	const welcomeScreens = blocks.filter(
		( block ) => block.type === 'welcome-screen'
	);
	const thankyouScreens = blocks.filter(
		( block ) => block.type === 'thankyou-screen'
	);

	const pathEditableFields = walkPath.filter( ( block ) => {
		const registeredBlock = blockTypes[ block.type ];
		return registeredBlock.supports.editable === true;
	} );

	const currentBlockIndex = $blocks.findIndex(
		( block ) => block.id === currentBlockId
	);

	const currentBlockCat =
		currentBlockIndex !== -1
			? $blocks[ currentBlockIndex ].type === 'welcome-screen'
				? 'welcomeScreens'
				: $blocks[ currentBlockIndex ].type === 'thankyou-screen'
				? 'thankyouScreens'
				: 'fields'
			: null;

	const isLastField =
		walkPath?.length > 0 &&
		walkPath[ walkPath.length - 1 ].id === currentBlockId;

	const isFirstField =
		walkPath?.length > 0 && walkPath[ 0 ].id === currentBlockId;

	useEffect( () => {
		if ( swiper.isAnimating ) {
			const timer = setTimeout( () => {
				setSwiper( ( prevSwiperState ) => {
					return {
						...prevSwiperState,
						isAnimating: false,
						shouldLastActiveBlockBeRendered: false,
					};
				} );
			}, 600 );
			return () => clearTimeout( timer );
		}
	}, [ swiper ] );
	useEffect( () => {
		if ( ! applyJumpLogic ) {
			const $currentPath = cloneDeep( formFields );
			const currentBlockBeingEditedIndex = $blocks.findIndex(
				( $block ) => $block.id === currentBlockBeingEdited
			);
			const currentFieldBeingEditedIndex = $currentPath.findIndex(
				( $field ) => $field.id === currentBlockBeingEdited
			);
			console.log( currentBlockBeingEdited );
			console.log( currentFieldBeingEditedIndex );
			const $isThankyouScreenActive =
				$blocks[ currentBlockBeingEditedIndex ]?.type ===
				'thankyou-screen';
			setSwiper( ( prevSwiperState ) => {
				const $nextBlockId =
					! $isThankyouScreenActive &&
					$currentPath?.length > 0 &&
					$currentPath[ currentFieldBeingEditedIndex + 1 ]
						? $currentPath[ currentFieldBeingEditedIndex + 1 ].id
						: undefined;
				const $prevBlockId =
					! $isThankyouScreenActive &&
					$currentPath?.length > 0 &&
					$currentPath[ currentBlockBeingEditedIndex - 1 ]
						? $currentPath[ currentBlockBeingEditedIndex - 1 ].id
						: undefined;
				const newState = {
					...prevSwiperState,
					walkPath: $currentPath,
					isAnimating: true,
					disableTransition: true,
					currentBlockId: currentBlockBeingEdited,
					nextBlockId: $nextBlockId,
					prevBlockId: $prevBlockId,
					canGoNext: $isThankyouScreenActive ? false : true,
					canGoPrev:
						$prevBlockId && ! $isThankyouScreenActive
							? true
							: false,
					isSubmissionScreenActive: undefined,
					isThankyouScreenActive: $isThankyouScreenActive,
					shouldLastActiveBlockBeRendered: false,
				};
				if (
					currentBlockBeingEdited !== prevSwiperState.currentBlockId
				) {
					newState.lastActiveBlockId = prevSwiperState.currentBlockId;
					newState.disableTransition = false;
				}
				return newState;
			} );
		}
	}, [ JSON.stringify( blocks ), currentBlockBeingEdited, applyJumpLogic ] );

	const submitHandler = () => {
		setSwiper( ( prevSwiperState ) => {
			return {
				...prevSwiperState,
				canGoNext: false,
				canGoPrev: false,
				isSubmissionScreenActive: false,
				isThankyouScreenActive: true,
				currentBlockId: prevSwiperState.nextBlockId
					? prevSwiperState.nextBlockId
					: thankyouScreens[ 0 ].id,
				prevBlockId: undefined,
				nextBlockId: undefined,
				lastActiveBlockId: undefined,
				disableTransition: false,
			};
		} );
	};

	// go to the next field
	const goNext = ( isSwiping = false ) => {
		if ( isAnimating ) return;
		setSwiper( ( prevSwiperState ) => {
			const currentFieldIndex = walkPath.findIndex(
				( field ) => field.id === prevSwiperState.currentBlockId
			);
			let $newCurrentBlockId = prevSwiperState.nextBlockId;
			// To check if the new current block is within the path, if it isn't, navigate to submission screen.
			// This should apply only when the next block is before the current block.
			const $newCurrentBlockIndex = walkPath.findIndex(
				( $field ) => $field.id === $newCurrentBlockId
			);

			if (
				isLastField &&
				( $newCurrentBlockIndex === -1 ||
					$newCurrentBlockIndex === currentFieldIndex ||
					// In case of swiping by mouse wheel or nav buttons, don't go back to the next block, continue
					// to submission screen
					isSwiping )
			) {
				$newCurrentBlockId = null;
			}

			return {
				...prevSwiperState,
				canGoNext: ! $newCurrentBlockId ? false : true,
				canGoPrev: true,
				currentBlockId: $newCurrentBlockId,
				prevBlockId: $newCurrentBlockId
					? walkPath[ $newCurrentBlockIndex - 1 ]
						? walkPath[ $newCurrentBlockIndex - 1 ].id
						: undefined
					: walkPath[ walkPath.length - 1 ].id,
				lastActiveBlockId: prevSwiperState.currentBlockId,
				nextBlockId:
					$newCurrentBlockIndex !== -1
						? walkPath[ $newCurrentBlockIndex + 1 ]
							? walkPath[ $newCurrentBlockIndex + 1 ].id
							: undefined
						: prevSwiperState.nextBlockId,
				isAnimating: true,
				disableTransition: false,
				isSubmissionScreenActive: ! $newCurrentBlockId
					? true
					: undefined,
				isThankyouScreenActive: false,
				shouldLastActiveBlockBeRendered: true,
			};
		} );
	};

	// Get Previous Field
	const goPrev = () => {
		if ( isAnimating ) return;
		setSwiper( ( prevSwiperState ) => {
			const currentFieldIndex = walkPath.findIndex(
				( field ) => field.id === prevSwiperState.currentBlockId
			);
			return {
				...prevSwiperState,
				canGoPrev:
					walkPath[ currentFieldIndex - 2 ] ||
					isSubmissionScreenActive
						? true
						: false,
				canGoNext: true,
				currentBlockId: prevSwiperState.prevBlockId,
				lastActiveBlockId: prevSwiperState.currentBlockId,
				nextBlockId: prevSwiperState.currentBlockId,
				prevBlockId:
					prevSwiperState.isSubmissionScreenActive === true
						? walkPath[ walkPath.length - 2 ]?.id
							? walkPath[ walkPath.length - 2 ].id
							: undefined
						: walkPath[ currentFieldIndex - 2 ]?.id
						? walkPath[ currentFieldIndex - 2 ].id
						: undefined,
				isAnimating: true,
				isSubmissionScreenActive: prevSwiperState.isSubmissionScreenActive
					? false
					: undefined,
				disableTransition: false,
				isThankyouScreenActive: false,
			};
		} );
	};

	// Mouse Wheel Handler
	const scrollHandler = useCallback( ( e ) => {
		e.stopPropagation();
		if ( swiper.isAnimating ) return;
		const lethargyCheck = lethargy.check( e );
		const now = new Date().getTime();
		if (
			lethargyCheck === false ||
			isAnimating ||
			( lastScrollDate && now - lastScrollDate < 750 )
		)
			return;
		if (
			canGoPrev &&
			lethargyCheck === 1 &&
			e.deltaY < -50 &&
			! isFirstField
		) {
			// Scroll up
			lastScrollDate = new Date().getTime();
			goPrev();
		} else if (
			canGoNext &&
			lethargyCheck === -1 &&
			e.deltaY > 50 &&
			! isSubmissionScreenActive
		) {
			lastScrollDate = new Date().getTime();
			// Scroll down
			goNext();
		}
	} );

	const getBlocksToRender = () => {
		const fields = [];
		const filteredBlocks = walkPath.filter(
			( block ) =>
				block.id === currentBlockId ||
				block.id === nextBlockId ||
				block.id === prevBlockId ||
				( shouldLastActiveBlockBeRendered &&
					block.id === lastActiveBlockId )
		);
		filteredBlocks.forEach( ( block ) => {
			if (
				block.type !== 'welcome-screen' ||
				block.type !== 'thankyou-screen'
			) {
				fields.push( block );
			}
		} );
		return { fields };
	};

	const { fields } = getBlocksToRender();
	return (
		<div
			className={ classnames(
				'renderer-core-form-content',
				css`
					background: ${theme.backgroundColor};
					font-family: ${theme.font};
				`
			) }
		>
			{ blocks?.length > 0 && (
				<Fragment>
					{ currentBlockCat === 'welcomeScreens' &&
						welcomeScreens?.length > 0 &&
						welcomeScreens.map( ( screen ) => {
							const blockType = blockTypes[ 'welcome-screen' ];
							return (
								<blockType.rendererConfig.output
									next={ goNext }
									isActive={ currentBlockId === screen.id }
									key={ screen.id }
									id={ screen.id }
									title={ screen.title }
									description={ screen.description }
									attributes={ screen.attributes }
									attachment={ screen.attachment }
								/>
							);
						} ) }
					{ ! isThankyouScreenActive && fields?.length > 0 && (
						<FieldsWrapper
							currentBlockId={ currentBlockId }
							setSwiper={ setSwiper }
							isActive={ currentBlockCat === 'fields' }
							scrollHandler={ scrollHandler }
							applyJumpLogic={ applyJumpLogic }
						>
							{ ( isFocused ) => (
								<>
									{ fields.map( ( field ) => {
										const blockIndex = walkPath.findIndex(
											( block ) => block.id === field.id
										);

										const currentFieldIndex = walkPath.findIndex(
											( $field ) =>
												$field.id === currentBlockId
										);

										const lastActiveBlockIndex = walkPath.findIndex(
											( block ) =>
												block.id === lastActiveBlockId
										);
										const animation =
											disableTransition || ! isAnimating
												? null
												: lastActiveBlockId === field.id
												? currentFieldIndex >
														blockIndex ||
												  isSubmissionScreenActive
													? 'moveUp'
													: 'moveDown'
												: currentBlockId === field.id
												? lastActiveBlockIndex !== -1 &&
												  lastActiveBlockIndex <=
														currentFieldIndex
													? 'moveUpFromDown'
													: 'moveDownFromUp'
												: null;
										const counter = pathEditableFields.findIndex(
											( editableField ) =>
												editableField.id === field.id
										);
										return (
											<FieldRender
												field={ field }
												counter={ counter }
												isAnimating={ isAnimating }
												isFocused={ isFocused }
												animation={ animation }
												key={ `field-render-${ field.id }` }
												isActive={
													currentBlockId === field.id
												}
												id={ field.id }
												setCanGoNext={ ( val ) => {
													if (
														lastActiveBlockId ===
														field.id
													)
														return;
													setSwiper(
														( prevSwiperState ) => {
															return {
																...prevSwiperState,
																canGoNext: val,
															};
														}
													);
												} }
												setCanGoPrev={ ( val ) => {
													if (
														formFields[ 0 ].id ===
														field.id
													)
														return;
													setSwiper(
														( prevSwiperState ) => {
															return {
																...prevSwiperState,
																canGoPrev: val,
															};
														}
													);
												} }
												next={ goNext }
											/>
										);
									} ) }
									<SubmissionScreen
										submitHandler={ submitHandler }
										active={ isSubmissionScreenActive }
									/>
								</>
							) }
						</FieldsWrapper>
					) }
					<>
						{ isThankyouScreenActive && (
							<>
								{ currentBlockId ===
								'default_thankyou_screen' ? (
									<DefaultThankYouScreen
										isActive={ isThankyouScreenActive }
									/>
								) : (
									<>
										{ thankyouScreens?.length > 0 &&
											thankyouScreens.map( ( screen ) => {
												const blockType =
													blockTypes[
														'thankyou-screen'
													];
												return (
													<blockType.rendererConfig.output
														isActive={
															currentBlockId ===
															screen.id
														}
														key={ screen.id }
														id={ screen.id }
														title={ screen.title }
														description={
															screen.description
														}
														attributes={
															screen.attributes
														}
														attachment={
															screen.attachment
														}
													/>
												);
											} ) }
									</>
								) }
							</>
						) }
					</>
				</Fragment>
			) }
			<FormFooter
				currentBlockCat={ currentBlockCat }
				currentBlockId={ currentBlockId }
				pathEditableFields={ pathEditableFields }
			/>
		</div>
	);
};
export default FormContent;

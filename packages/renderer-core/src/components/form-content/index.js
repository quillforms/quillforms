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
import { cloneDeep } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import SubmissionScreen from '../submission-screen';
import DefaultThankYouScreen from '../default-thankyou-screen';

let lastScrollDate = 0;
const lethargy = new Lethargy();
const FormContent = ( { walkPath, setWalkPath } ) => {
	const blockTypes = useBlockTypes();
	const blocks = useMetaField( 'blocks' );
	const theme = useTheme();
	const { currentBlockBeingEdited, currentBlockBeingEditedIndex } = useSelect(
		( select ) => {
			return {
				currentBlockBeingEdited: select(
					'quillForms/block-editor'
				).getCurrentBlockId(),
				currentBlockBeingEditedIndex: select(
					'quillForms/block-editor'
				).getCurrentBlockIndex(),
			};
		}
	);

	const [ swiper, setSwiper ] = useState( {
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
	} );

	const {
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
	} = swiper;

	console.log( swiper );
	const formFields = walkPath.filter(
		( block ) =>
			block.type !== 'thankyou-screen' && block.type !== 'welcome-screen'
	);

	const pathEditableFields = formFields.filter( ( block ) => {
		const registeredBlock = blockTypes[ block.type ];
		return registeredBlock.supports.editable === true;
	} );

	const currentBlockIndex = walkPath.findIndex(
		( block ) => block.id === currentBlockId
	);

	const currentBlockCat =
		currentBlockIndex !== -1
			? walkPath[ currentBlockIndex ].type === 'welcome-screen'
				? 'welcomeScreens'
				: walkPath[ currentBlockIndex ].type === 'thankyou-screen'
				? 'thankyouScreens'
				: 'fields'
			: null;

	const isLastField =
		formFields?.length > 0 &&
		formFields[ formFields.length - 1 ].id === currentBlockId;

	const isFirstField =
		formFields?.length > 0 && formFields[ 0 ].id === currentBlockId;

	useEffect( () => {
		if ( swiper.isAnimating ) {
			const timer = setTimeout( () => {
				setSwiper( ( prevSwiperState ) => {
					return { ...prevSwiperState, isAnimating: false };
				} );
			}, 500 );
			return () => clearTimeout( timer );
		}
	}, [ swiper ] );

	useEffect( () => {
		const $currentPath = cloneDeep( blocks );
		setWalkPath( $currentPath );
		const $isThankyouScreenActive =
			$currentPath[ currentBlockBeingEditedIndex ]?.type ===
			'thankyou-screen';
		setSwiper( ( prevSwiperState ) => {
			const $nextBlockId =
				$currentPath?.length > 0 &&
				$currentPath[ currentBlockBeingEditedIndex + 1 ]
					? $currentPath[ currentBlockBeingEditedIndex + 1 ].id
					: undefined;
			const $prevBlockId =
				$currentPath?.length > 0 &&
				$currentPath[ currentBlockBeingEditedIndex - 1 ]
					? $currentPath[ currentBlockBeingEditedIndex - 1 ].id
					: undefined;
			const newState = {
				...prevSwiperState,
				isAnimating: true,
				disableTransition: true,
				currentBlockId: currentBlockBeingEdited,
				nextBlockId: $nextBlockId,
				prevBlockId: $prevBlockId,
				canGoNext: $isThankyouScreenActive ? false : true,
				canGoPrev:
					$prevBlockId && ! $isThankyouScreenActive ? true : false,
				isSubmissionScreenActive: undefined,
				isThankyouScreenActive: $isThankyouScreenActive,
			};
			if ( currentBlockBeingEdited !== prevSwiperState.currentBlockId ) {
				newState.lastActiveBlockId = prevSwiperState.currentBlockId;
				newState.disableTransition = false;
			}
			return newState;
		} );
	}, [ JSON.stringify( blocks ), currentBlockBeingEdited ] );

	const submitHandler = () => {
		setSwiper( {
			canGoNext: false,
			canGoPrev: false,
			isSubmissionScreenActive: false,
			isThankyouScreenActive: true,
			currentBlockId: 'default-thankyou-screen',
			prevBlockId: undefined,
			nextBlockId: undefined,
			lastActiveBlockId: undefined,
			disableTransition: false,
		} );
	};

	// go to the next field
	const goNext = () => {
		if ( isAnimating ) return;
		setSwiper( ( prevSwiperState ) => {
			return {
				...prevSwiperState,
				canGoNext: isLastField ? false : true,
				canGoPrev: true,
				currentBlockId: isLastField
					? null
					: prevSwiperState.nextBlockId,
				prevBlockId: prevSwiperState.currentBlockId,
				lastActiveBlockId: prevSwiperState.currentBlockId,
				nextBlockId: walkPath[ currentBlockIndex + 2 ]
					? walkPath[ currentBlockIndex + 2 ].id
					: undefined,
				isAnimating: true,
				disableTransition: false,
				isSubmissionScreenActive: isLastField ? true : undefined,
				isThankyouScreenActive: false,
			};
		} );
	};

	// Get Previous Field
	const goPrev = () => {
		if ( isAnimating ) return;
		setSwiper( ( prevSwiperState ) => {
			console.log( prevSwiperState );
			return {
				...prevSwiperState,
				canGoPrev:
					walkPath[ currentBlockIndex - 2 ] ||
					isSubmissionScreenActive
						? true
						: false,
				canGoNext: true,
				currentBlockId: prevSwiperState.prevBlockId,
				lastActiveBlockId: prevSwiperState.currentBlockId,
				nextBlockId: prevSwiperState.currentBlockId,
				prevBlockId:
					prevSwiperState.isSubmissionScreenActive === true
						? formFields[ formFields.length - 2 ]?.id
							? formFields[ formFields.length - 2 ].id
							: undefined
						: walkPath[ currentBlockIndex - 2 ]?.id
						? walkPath[ currentBlockIndex - 2 ].id
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
		const welcomeScreens = [],
			thankyouScreens = [],
			fields = [];
		const filteredBlocks = walkPath.filter(
			( block ) =>
				block.id === currentBlockId ||
				block.id === nextBlockId ||
				block.id === prevBlockId
		);
		filteredBlocks.forEach( ( block ) => {
			if ( block.type === 'welcome-screen' ) {
				welcomeScreens.push( block );
			} else if ( block.type === 'thankyou-screen' ) {
				thankyouScreens.push( block );
			} else {
				fields.push( block );
			}
		} );
		return { fields, welcomeScreens, thankyouScreens };
	};

	const { welcomeScreens, thankyouScreens, fields } = getBlocksToRender();
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
					{ welcomeScreens?.length > 0 &&
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
							setWalkPath={ setWalkPath }
						>
							{ ( isFocused ) => (
								<>
									{ fields.map( ( field ) => {
										const blockIndex = walkPath.findIndex(
											( block ) => block.id === field.id
										);
										const lastActiveBlockIndex = walkPath.findIndex(
											( block ) =>
												block.id === lastActiveBlockId
										);
										const animation = disableTransition
											? null
											: lastActiveBlockId === field.id
											? currentBlockIndex > blockIndex ||
											  isSubmissionScreenActive
												? 'moveUp'
												: 'moveDown'
											: currentBlockId === field.id
											? lastActiveBlockIndex !== -1 &&
											  lastActiveBlockIndex <=
													currentBlockIndex
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

					{ currentBlockId === 'default-thankyou-screen' ||
					nextBlockId === 'default-thankyou-screen' ? (
						<DefaultThankYouScreen
							isActive={ isThankyouScreenActive }
						/>
					) : (
						<>
							{ thankyouScreens?.length > 0 &&
								thankyouScreens.map( ( screen ) => {
									const blockType =
										blockTypes[ 'thankyou-screen' ];
									return (
										<blockType.rendererConfig.output
											isActive={
												currentBlockId === screen.id
											}
											key={ screen.id }
											id={ screen.id }
											title={ screen.title }
											description={ screen.description }
											attributes={ screen.attributes }
											attachment={ screen.attachment }
										/>
									);
								} ) }
						</>
					) }
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

/* eslint-disable no-nested-ternary */
/**
 * Wordpress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import { Lethargy } from 'lethargy';
import React from 'react';

/**
 * Internal Dependencies
 */
import FieldRender from '../field-render';
import {
	useBlocks,
	useBlockTypes,
	useFormSettings,
	useLogic,
	useHiddenFields,
} from '../../hooks';

let lastScrollDate = 0;
const lethargy = new Lethargy();

interface Props {
	applyLogic: boolean;
	isActive: boolean;
}

const FieldsWrapper: React.FC< Props > = ( { applyLogic, isActive } ) => {
	const blocks = useBlocks();
	const blockTypes = useBlockTypes();
	const logic = useLogic();
	const hiddenFields = useHiddenFields();
	const settings = useFormSettings();
	const ref = useRef< HTMLDivElement | null >( null );
	const { swiper } = useSelect( ( select ) => {
		return {
			swiper: select( 'quillForms/renderer-core' ).getSwiperState(),
		};
	} );

	const {
		walkPath,
		currentBlockId,
		nextBlockId,
		prevBlockId,
		lastActiveBlockId,
		canSwipeNext,
		canSwipePrev,
		isAnimating,
	} = swiper;

	const { answers, currentBlockAnswer } = useSelect( ( select ) => {
		return {
			answers: select( 'quillForms/renderer-core' ).getAnswers(),
			currentBlockAnswer: currentBlockId
				? select( 'quillForms/renderer-core' ).getFieldAnswerVal(
						currentBlockId
				  )
				: null,
		};
	} );

	const currentBlockIndex = walkPath.findIndex(
		( block ) => block.id === currentBlockId
	);
	const lastActiveBlockIndex = walkPath.findIndex(
		( block ) => block.id === lastActiveBlockId
	);

	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
		// @ts-expect-error
		navigator.msMaxTouchPoints > 0;
	const getFieldsToRender = (): string[] => {
		const fieldIds: string[] = [];
		const filteredBlocks = walkPath.filter(
			( block ) =>
				answers[ block.id ]?.isPending ||
				block.id === currentBlockId ||
				( ! isTouchScreen && block.id === nextBlockId ) ||
				( ! isTouchScreen && block.id === prevBlockId ) ||
				( ! isTouchScreen && block.id === lastActiveBlockId )
		);
		filteredBlocks.forEach( ( block ) => {
			if (
				block.name !== 'welcome-screen' &&
				block.name !== 'thankyou-screen'
			) {
				fieldIds.push( block.id );
			}
		} );
		return fieldIds;
	};

	const fieldsToRender = getFieldsToRender();
	const fields = walkPath.filter(
		( block ) =>
			block.name !== 'welcome-screen' && block.name !== 'thankyou-screen'
	);

	const { setSwiper, goNext, goPrev } = useDispatch(
		'quillForms/renderer-core'
	);

	const isFirstField =
		walkPath?.length > 0 && walkPath[ 0 ].id === currentBlockId;

	const isLastField =
		walkPath?.length &&
		currentBlockId === walkPath[ walkPath.length - 1 ].id;

	const handlers = useSwipeable( {
		onSwiping: ( e ) => {
			swipingHandler( e, true );
		},
		preventDefaultTouchmoveEvent: false,
		trackMouse: false,
		trackTouch: true,
		delta: 70,
	} );

	// Mouse Wheel Handler
	const swipingHandler = (
		e: React.WheelEvent | SwipeEventData,
		touch = false
	) => {
		if ( settings?.disableWheelSwiping ) return;
		let delta = e.deltaY;
		if ( settings?.animationDirection === 'horizontal' ) {
			delta = e.deltaX;
		}
		if ( swiper.isAnimating ) return;
		const lethargyCheck = lethargy.check( e );
		const now = new Date().getTime();
		let timeDelay = 750;
		if ( touch ) timeDelay = 500;
		if (
			lethargyCheck === false ||
			isAnimating ||
			( lastScrollDate && now - lastScrollDate < timeDelay )
		)
			return;
		if (
			canSwipePrev &&
			( ( delta < -50 && ! touch ) ||
				( touch &&
					delta > 50 &&
					( e as SwipeEventData ).dir === 'Down' ) ) &&
			! isFirstField
		) {
			// Scroll up
			lastScrollDate = new Date().getTime();
			goPrev();
		} else if (
			canSwipeNext &&
			( ( delta < -50 &&
				touch &&
				( e as SwipeEventData ).dir === 'Up' ) ||
				( ! touch && delta > 50 ) ) &&
			! isLastField
		) {
			lastScrollDate = new Date().getTime();
			// Scroll down
			goNext();
		}
	};

	useEffect( (): void | ( () => void ) => {
		if ( isAnimating ) {
			const timer = setTimeout( () => {
				setSwiper( {
					isAnimating: false,
				} );
			}, 600 );
			return () => clearTimeout( timer );
		}
	}, [ swiper ] );

	useEffect( () => {
		if ( applyLogic && isActive ) {
			doAction(
				'QuillForms.RendererCore.LogicApply',
				blocks,
				blockTypes,
				logic,
				hiddenFields
			);
		}
	}, [ currentBlockAnswer, currentBlockId ] );

	useEffect( () => {
		if ( applyLogic && isActive ) {
			setSwiper( {
				currentBlockId: blocks[ 0 ].id,
				prevBlockId: undefined,
				canSwipePrev: false,
				lastActiveBlockId: undefined,
			} );
			doAction(
				'QuillForms.RendererCore.LogicApply',
				blocks,
				blockTypes,
				logic,
				hiddenFields
			);
		}
		if ( ! applyLogic ) {
			doAction( 'QuillForms.RendererCore.LogicTurnOff' );
		}
	}, [ applyLogic ] );

	// const isThereNextField =
	// 	fields.filter( ( field ) => field.id === nextBlockId ).length === 0;

	return (
		<div
			onWheel={ swipingHandler }
			className={ classNames( 'renderer-core-fields-wrapper', {
				active: isActive,
				'is-moving-up':
					isAnimating && currentBlockIndex < lastActiveBlockIndex,
				'is-moving-down':
					isAnimating && currentBlockIndex > lastActiveBlockIndex,
			} ) }
			ref={ ref }
			aria-hidden={ isActive ? false : true }
		>
			<div { ...handlers }>
				{ fields.map( ( field, index ) => {
					const isActive = currentBlockId === field.id;
					return (
						<FieldRender
							key={ `${ field.id }` }
							id={ field.id }
							shouldBeRendered={ fieldsToRender.includes(
								field.id
							) }
							isActive={ isActive }
							isLastField={
								// isThereNextField &&
								index === fields.length - 1
							}
						/>
					);
				} ) }
			</div>
		</div>
	);
};
export default FieldsWrapper;

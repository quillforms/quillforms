/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import { FormBlocks } from '@quillforms/types';

/**
 * Wordpress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import classNames from 'classnames';
import { useSwipeable, SwipeEventData } from 'react-swipeable';
import { Lethargy } from 'lethargy';

/**
 * Internal Dependencies
 */
import FieldRender from '../field-render';
import useLogic from '../../hooks/use-logic';
import useBlocks from '../../hooks/use-blocks';
import React from 'react';

let lastScrollDate = 0;
const lethargy = new Lethargy();

interface Props {
	applyLogic: boolean;
	isActive: boolean;
}

const FieldsWrapper: React.FC< Props > = ( { applyLogic, isActive } ) => {
	const jumpLogic = useLogic();
	const blocks = useBlocks();
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

	const isTouchScreen =
		'ontouchstart' in window ||
		navigator.maxTouchPoints > 0 ||
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
	const fields = blocks.filter(
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
			( ( e.deltaY < -50 && ! touch ) ||
				( touch &&
					e.deltaY > 50 &&
					( e as SwipeEventData ).dir === 'Down' ) ) &&
			! isFirstField
		) {
			// Scroll up
			lastScrollDate = new Date().getTime();
			goPrev();
		} else if (
			canSwipeNext &&
			( ( e.deltaY < -50 &&
				touch &&
				( e as SwipeEventData ).dir === 'Up' ) ||
				( ! touch && e.deltaY > 50 ) ) &&
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

	// const currentBlock = blocks.find(
	// 	( block ) => block.id === currentBlockId
	// );
	// const { isCurrentBlockEditable } = useSelect( ( select ) => {
	// 	return {
	// 		isCurrentBlockEditable: currentBlock
	// 			? select( 'quillForms/blocks' ).hasBlockSupport(
	// 					currentBlock.name,
	// 					'editable'
	// 			  )
	// 			: null,
	// 	};
	// } );

	const isConditionFulfilled = (
		conditionOperator: string,
		conditionVal: unknown,
		fieldValue: unknown
	): boolean => {
		switch ( conditionOperator ) {
			case 'is': {
				if ( Array.isArray( fieldValue ) )
					return fieldValue.includes( conditionVal );

				if (
					typeof conditionVal === 'number' &&
					typeof fieldValue === 'string'
				)
					return parseInt( fieldValue ) === conditionVal;

				return fieldValue === conditionVal;
			}

			case 'is_not': {
				if ( Array.isArray( fieldValue ) )
					return ! fieldValue.includes( conditionVal );

				return fieldValue !== conditionVal;
			}

			case 'greater_than': {
				if (
					typeof fieldValue !== 'number' ||
					typeof conditionVal !== 'number'
				) {
					return false;
				}

				return fieldValue > conditionVal;
			}

			case 'lower_than': {
				if (
					typeof fieldValue !== 'number' ||
					typeof conditionVal !== 'number'
				) {
					return false;
				}

				return fieldValue < conditionVal;
			}

			case 'contains': {
				if (
					typeof fieldValue !== 'string' ||
					typeof conditionVal !== 'string'
				) {
					return false;
				}
				return fieldValue.indexOf( conditionVal ) !== -1;
			}

			case 'starts_with': {
				if (
					typeof fieldValue !== 'string' ||
					typeof conditionVal !== 'string'
				) {
					return false;
				}
				return fieldValue.startsWith( conditionVal );
			}

			case 'ends_with': {
				if (
					typeof fieldValue !== 'string' ||
					typeof conditionVal !== 'string'
				) {
					return false;
				}
				return fieldValue.endsWith( conditionVal );
			}
		}
		return false;
	};

	const isGroupConditionsMet = ( groupConditions ): boolean => {
		for ( let condition of groupConditions ) {
			const { op, vars } = condition;
			const fieldId = vars[ 0 ].value;
			const fieldAnswer = answers[ fieldId ]?.value;
			const value = vars[ 1 ].value;
			if ( ! isConditionFulfilled( op, value, fieldAnswer ) ) {
				return false;
			}
		}
		return true;
	};

	const isConditionsMet = ( conditions ): boolean => {
		for ( let groupConditions of conditions ) {
			if ( isGroupConditionsMet( groupConditions ) ) {
				return true;
			}
		}
		return false;
	};

	const getBlockIndex = ( blockId: string | undefined ) => {
		if ( ! blockId ) {
			return -1;
		}
		return blocks.findIndex( ( block ) => block.id === blockId );
	};

	const generatePath = () => {
		const path: FormBlocks = [];
		let index = 0;
		blocks_loop: do {
			const question = blocks[ index ];
			if ( question.name === 'welcome-screen' ) {
				index++;
				continue;
			}
			if ( question.name === 'thankyou-screen' ) {
				break;
			}
			path.push( question );
			const blockJumpLogic = jumpLogic?.[ question.id ];
			if ( blockJumpLogic && blockJumpLogic.length !== 0 ) {
				for ( let action of blockJumpLogic ) {
					if (
						action?.conditions &&
						isConditionsMet( action.conditions )
					) {
						let targetIndex = getBlockIndex( action.target );
						if ( targetIndex !== -1 ) {
							index = targetIndex;
							continue blocks_loop;
						}
					}
				}
			}
			index++;
		} while ( index < blocks.length );

		let currentBlockIndex = path.findIndex(
			( block ) => block.id === currentBlockId
		);
		let nextBlockId = path[ currentBlockIndex + 1 ]?.id ?? undefined;

		return { path, nextBlockId };
	};

	useEffect( () => {
		if ( applyLogic && isActive ) {
			const { path, nextBlockId } = generatePath();
			setSwiper( {
				walkPath: path,
				nextBlockId,
			} );
		}
	}, [ currentBlockAnswer, currentBlockId ] );

	useEffect( () => {
		if ( applyLogic && isActive ) {
			const { path, nextBlockId } = generatePath();
			setSwiper( {
				walkPath: path,
				currentBlockId: blocks[ 0 ].id,
				prevBlockId: undefined,
				canSwipePrev: false,
				lastActiveBlockId: undefined,
				nextBlockId,
			} );
		}
	}, [ applyLogic ] );

	return (
		<div
			onWheel={ swipingHandler }
			className={ classNames( 'renderer-core-fields-wrapper', {
				active: isActive,
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
							isLastField={ index === fields.length - 1 }
						/>
					);
				} ) }
			</div>
		</div>
	);
};
export default FieldsWrapper;

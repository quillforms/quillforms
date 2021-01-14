/* eslint-disable no-nested-ternary */
/**
 * Wordpress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useState, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import { forEach } from '@quillforms/utils';

/**
 * Internal Dependencies
 */
import useLogic from '../../hooks/use-logic';
import useBlocks from '../../hooks/use-blocks';

const FieldsWrapper = ( {
	currentBlockId,
	children,
	isActive,
	scrollHandler,
	setSwiper,
	applyLogic,
} ) => {
	const jumpLogic = useLogic();
	const blocks = useBlocks();
	const [ isFocused, setIsFocused ] = useState( false );
	const ref = useRef();
	const currentBlock = blocks.find(
		( block ) => block.id === currentBlockId
	);

	const { isCurrentBlockEditable } = useSelect( ( select ) => {
		return {
			isCurrentBlockEditable: currentBlock
				? select( 'quillForms/blocks' ).hasBlockSupport(
						currentBlock.type,
						'editable'
				  )
				: null,
		};
	} );
	const { answers, currentBlockAnswer } = useSelect( ( select ) => {
		return {
			answers: isCurrentBlockEditable
				? select( 'quillForms/renderer-submission' ).getAnswers()
				: null,
			currentBlockAnswer: isCurrentBlockEditable
				? select( 'quillForms/renderer-submission' ).getFieldAnswerVal(
						currentBlockId
				  )
				: null,
		};
	} );

	const handleClickOutside = ( e ) => {
		if ( ref.current && ! ref.current.contains( e.target ) ) {
			setIsFocused( false );
		}
	};

	// Attaching the previous event with UseEffect hook
	useEffect( () => {
		// Bind the event listener
		document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	} );

	const operators = {
		is: ( a, b ) => a === b,
		is_not: ( a, b ) => a !== b,
		lower_than: ( a, b ) => a < b,
		greater_than: ( a, b ) => a > b,
		contains: ( a, b ) => {
			if ( ! a ) {
				return false;
			}
			return a.indexOf( b ) >= 0;
		},
		not_contains: ( a, b ) => {
			if ( ! a ) {
				return true;
			}
			return a.indexOf( b ) === -1;
		},
		starts_with: ( a, b ) => {
			if ( ! a ) {
				return true;
			}
			return a.indexOf( b ) === 0;
		},
		ends_with: ( a, b ) => {
			if ( ! a ) {
				return true;
			}
			return a.indexOf( b ) === b.length - 1;
		},
	};

	const getBlockLogic = ( blockId ) => {
		return jumpLogic?.length > 0
			? jumpLogic.find( ( blockLogic ) => blockLogic.blockId === blockId )
			: null;
	};

	const ruleGroupConditionsMet = ( ruleGroupConditions ) => {
		let res = true;
		forEach( ruleGroupConditions, ( condition ) => {
			const { op, vars } = condition;
			const fieldId = vars[ 0 ].value;
			const fieldAnswer = answers.find(
				( answer ) => answer.id === fieldId
			).value;
			const value = vars[ 1 ].value;
			if ( ! operators[ op ]( fieldAnswer, value ) ) res = false;
		} );
		return res;
	};

	const conditionsMet = ( conditions ) => {
		let res = false;
		forEach( conditions, ( ruleGroupConditions ) => {
			if ( ruleGroupConditionsMet( ruleGroupConditions ) ) {
				res = true;
			}
		} );
		return res;
	};

	const getNextTarget = ( target, conditions ) => {
		if ( conditionsMet( conditions ) ) {
			return target;
		}
		return null;
	};

	const getBlockIndex = ( blockId ) => {
		return blocks.findIndex( ( block ) => block.id === blockId );
	};

	const generatePath = () => {
		const path = [];
		let nextBlockId;
		let index = 0;

		let shouldBreakTheWholeLoop = false;
		do {
			const question = blocks[ index ];
			if ( question.type === 'welcome-screen' ) {
				index++;
				continue;
			}
			if ( question.type === 'thankyou-screen' ) {
				break;
			}
			path.push( question );
			let newIndex = index;
			// debugger;
			const blockJumpLogic = getBlockLogic( question.id );
			if ( blockJumpLogic?.actions?.length > 0 ) {
				let $break = false;
				forEach( blockJumpLogic.actions, ( action ) => {
					if ( ! $break ) {
						if ( action?.conditions?.length > 0 ) {
							const nextId = getNextTarget(
								action.target,
								action.conditions
							);
							const nextBlockIndex = getBlockIndex( nextId );
							if ( nextId && nextBlockIndex !== -1 ) {
								if ( nextBlockIndex < index ) {
									shouldBreakTheWholeLoop = true;
								} else {
									newIndex = nextBlockIndex;
								}
								if ( currentBlockId === question.id ) {
									nextBlockId = nextId;
								}
								$break = true;
							}
						}
					}
				} );
				if ( newIndex === index && ! shouldBreakTheWholeLoop ) {
					index++;
				} else {
					index = newIndex;
				}
			} else {
				index++;
			}
			if ( currentBlockId === question.id ) {
				nextBlockId = nextBlockId
					? nextBlockId
					: blocks[ index ]?.id
					? blocks[ index ].id
					: undefined;
			}
			if ( shouldBreakTheWholeLoop ) break;
		} while ( index < blocks.length );

		return { path, nextBlockId };
	};

	useEffect( () => {
		if ( applyLogic && isActive ) {
			const { path, nextBlockId } = generatePath();
			setSwiper( ( prevSwiperState ) => {
				return {
					...prevSwiperState,
					walkPath: path,
					nextBlockId,
				};
			} );
		}
	}, [ currentBlockAnswer, isActive, currentBlockId ] );

	useEffect( () => {
		if ( applyLogic ) {
			const { path, nextBlockId } = generatePath();
			setSwiper( ( prevSwiperState ) => {
				return {
					...prevSwiperState,
					walkPath: path,
					currentBlockId: blocks[ 0 ].id,
					prevBlockId: null,
					canGoPrev: false,
					lastActiveBlockId: undefined,
					nextBlockId,
				};
			} );
		}
	}, [ applyLogic ] );
	return (
		<div
			onWheel={ scrollHandler }
			onFocus={ () => {
				setIsFocused( true );
			} }
			className={
				'renderer-core-fields-wrapper' + ( isActive ? ' active' : '' )
			}
			ref={ ref }
		>
			{ children( isFocused ) }
		</div>
	);
};
export default FieldsWrapper;

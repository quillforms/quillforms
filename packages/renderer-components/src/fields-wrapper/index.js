import useMetaField from '../hooks/use-meta-field';
import { useSelect } from '@wordpress/data';
import { forEach } from 'lodash';
import { useEffect, useState, useRef } from '@wordpress/element';

const FieldsWrapper = ( {
	currentBlockId,
	children,
	isActive,
	scrollHandler,
	setSwiper,
} ) => {
	const jumpLogic = useMetaField( 'jumpLogic' );
	const blocks = useMetaField( 'blocks' );
	const [ isFocused, setIsFocused ] = useState( false );
	const ref = useRef();
	const currentBlock = blocks.find(
		( block ) => block.id === currentBlockId
	);
	const { isCurrentBlockEditable } = useSelect( ( select ) => {
		return {
			isCurrentBlockEditable: select(
				'quillForms/blocks'
			).hasBlockSupport( currentBlock.type, 'editable' ),
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
		let shouldBreak = false;
		do {
			const question = blocks[ index ];
			path.push( question );
			const blockJumpLogic = getBlockLogic( question.id );
			if ( blockJumpLogic?.actions?.length > 0 ) {
				forEach( blockJumpLogic.actions, ( action ) => {
					if ( action?.conditions?.length > 0 ) {
						const nextId = getNextTarget(
							action.target,
							action.conditions
						);
						if ( nextId ) {
							const nextBlockIndex = getBlockIndex( nextId );
							if ( nextBlockIndex < index ) {
								shouldBreak = true;
							} else {
								index = nextBlockIndex;
							}
							if ( currentBlockId === question.id ) {
								nextBlockId = nextId;
							}
						} else {
							index++;
						}
					}
				} );
			} else {
				index++;
			}
			if ( shouldBreak ) break;
		} while ( index < blocks.length );

		return { path, nextBlockId };
	};

	useEffect( () => {
		if ( isCurrentBlockEditable ) {
			const { path, nextBlockId } = generatePath();
			setSwiper( ( prevSwiperState ) => {
				return {
					...prevSwiperState,
					currentPath: path,
					nextBlockId: nextBlockId
						? nextBlockId
						: prevSwiperState.nextBlockId,
				};
			} );
		}
	}, [ currentBlockAnswer ] );

	return (
		<div
			onWheel={ scrollHandler }
			onFocus={ () => {
				setIsFocused( true );
			} }
			className={
				'renderer-core-fileds-wrapper' + ( isActive ? ' active' : '' )
			}
			ref={ ref }
		>
			{ children( isFocused ) }
		</div>
	);
};
export default FieldsWrapper;

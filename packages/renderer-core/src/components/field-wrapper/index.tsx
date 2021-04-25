/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { useSwipeable } from 'react-swipeable';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import { useFieldRenderContext } from '../field-render/context';
import FieldContent from '../field-content';
import { filter, findIndex } from 'lodash';

let scrollTimer: ReturnType< typeof setTimeout >;
let tabTimer: ReturnType< typeof setTimeout >;

const FieldWrapper: React.FC = () => {
	const {
		id,
		isActive,
		shouldBeRendered,
		showErrMsg,
		next,
		isFocused,
		setIsFocused,
	} = useFieldRenderContext();
	if ( ! id ) return null;
	const { swiper, isValid } = useSelect( ( select ) => {
		return {
			swiper: select( 'quillForms/renderer-core' ).getSwiperState(),
			isValid: select( 'quillForms/renderer-core' ).isValidField( id ),
		};
	} );

	const { setSwiper, goToField, goNext, goPrev } = useDispatch(
		'quillForms/renderer-core'
	);

	const { walkPath, currentBlockId, isAnimating } = swiper;
	const setCanGoNext = ( val: boolean ) => {
		// if ( walkPath[ walkPath.length - 1 ].id === id ) val = false;
		setSwiper( {
			canGoNext: val,
		} );
	};
	const setCanGoPrev = ( val: boolean ) => {
		setSwiper( {
			canGoPrev: val,
		} );
	};
	const fieldIndex = walkPath.findIndex( ( field ) => field.id === id );

	const currentFieldIndex = walkPath.findIndex(
		( $field ) => $field.id === currentBlockId
	);

	const position = isActive
		? null
		: currentFieldIndex > fieldIndex
		? 'is-up'
		: 'is-down';

	const ref = useRef< HTMLDivElement | null >( null );

	const handlers = useSwipeable( {
		onSwiped: () => {
			// // // console.log("onSwiped");
		},
		onSwipedUp: () => {
			// // // console.log("onSwipeUp");
		},
		onSwiping: () => {
			// // // console.log("onSwiping");
		},
		preventDefaultTouchmoveEvent: true,
		trackMouse: true,
	} );

	useEffect( () => {
		if ( isActive ) {
			if ( ref?.current ) {
				setTimeout( () => {
					if ( ref?.current ) {
						ref.current.scrollTo( 0, 0 );
					}
				}, 0 );
			}
		} else {
			clearTimeout( tabTimer );
			clearTimeout( scrollTimer );
			setCanGoNext( true );
			setCanGoPrev( true );
		}
	}, [ isActive ] );

	useEffect( () => {
		if ( isAnimating ) clearTimeout( tabTimer );
	}, [ isAnimating ] );

	const focusableElementsString =
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

	/**
	 * Gets all the focusable elements inside the passed element.
	 */
	function getFocusables( el ) {
		return filter(
			Array.prototype.slice.call(
				document
					.querySelector( el )
					.querySelectorAll( focusableElementsString )
			),
			( item ) => {
				return (
					item.getAttribute( 'tabindex' ) !== '-1' &&
					//are also not hidden elements (or with hidden parents)
					item.offsetParent !== null &&
					window.getComputedStyle( item ).visibility !== 'hidden'
				);
			}
		);
	}

	function closest( el, selector ) {
		var matchesFn;

		// find vendor prefix
		[
			'matches',
			'webkitMatchesSelector',
			'mozMatchesSelector',
			'msMatchesSelector',
			'oMatchesSelector',
		].some( function ( fn ) {
			if ( typeof document.body[ fn ] == 'function' ) {
				matchesFn = fn;
				return true;
			}
			return false;
		} );

		var parent;

		// traverse parents
		while ( el ) {
			parent = el.parentElement;
			if ( parent && parent[ matchesFn ]( selector ) ) {
				return parent;
			}
			el = parent;
		}

		return null;
	}

	function processTab( e ) {
		e.preventDefault();
		if ( isAnimating ) {
			return;
		}
		var isShiftPressed = e.shiftKey;
		var activeElement = document.activeElement;
		var focusableElements = getFocusables( `#block-${ id }` );

		function focusFirst( e ) {
			e.preventDefault();
			return focusableElements[ 0 ]
				? focusableElements[ 0 ].focus()
				: null;
		}

		//outside the block? Let's not hijack the tab!
		if ( ! isFocused ) {
			return;
		}

		const activeElementIndex = findIndex(
			focusableElements,
			( el ) => el === activeElement
		);

		//is there an element with focus?
		if ( activeElement ) {
			if ( closest( activeElement, `#block-${ id }` ) == null ) {
				activeElement = focusFirst( e );
			}
		}

		//no element if focused? Let's focus the first one of the block focusable elements
		else {
			focusFirst( e );
		}
		if ( ! isShiftPressed ) {
			if (
				activeElement ==
				focusableElements[ focusableElements.length - 1 ]
			) {
				goNext();
			} else {
				if (
					focusableElements[ activeElementIndex + 1 ].offsetParent !==
					null
				) {
					focusableElements[ activeElementIndex + 1 ].focus();
				} else {
					//when reached the last focusable element of the block, go next
					goNext();
				}
			}
		} else {
			//when reached the first  focusable element of the block, go prev if shift is pressed
			if ( activeElement == focusableElements[ 0 ] ) {
				goPrev();
			} else {
				focusableElements[ activeElementIndex - 1 ].focus();
			}
		}

		return;
	}
	/**
	 * Makes sure the tab key will only focus elements within the current block  preventing this way from breaking the page.
	 * Otherwise, go next or prev.
	 */
	function onTab( e ) {
		clearTimeout( tabTimer );
		if ( isAnimating ) return;
		tabTimer = setTimeout( () => {
			processTab( e );
		}, 150 );
	}

	return (
		<div
			{ ...handlers }
			className={ classnames(
				'renderer-components-field-wrapper',
				{
					active: isActive,
				},
				position ? position : ''
			) }
			onScroll={ ( e ) => {
				e.preventDefault();
				if ( ! ref.current ) return;
				if ( ref.current.scrollTop === 0 ) {
					scrollTimer = setTimeout( () => {
						setCanGoPrev( true );
					}, 500 );
				} else {
					setCanGoPrev( false );
				}
				if (
					ref.current.scrollHeight - ref.current.clientHeight ===
					ref.current.scrollTop
				) {
					scrollTimer = setTimeout( () => {
						setCanGoNext( true );
					}, 500 );
				} else {
					setCanGoNext( false );
				}
			} }
			onFocus={ ( e ) => {
				e.preventDefault();
				if ( isAnimating ) return;
				if ( ! isActive ) {
					goToField( id );
				}
				if ( ! isFocused ) {
					setIsFocused( true );
				}
			} }
		>
			{ shouldBeRendered && (
				<section id={ 'block-' + id }>
					<div
						className="renderer-components-field-wrapper__content-wrapper"
						ref={ ref }
						tabIndex={ 0 }
						onKeyDown={ ( e: KeyboardEvent ): void => {
							if ( isAnimating ) {
								e.preventDefault();
								return;
							}
							if ( e.key === 'Enter' ) {
								if ( isValid ) {
									next();
								} else {
									showErrMsg( true );
								}
							} else {
								//tab?
								if ( e.key === 'Tab' ) {
									e.stopPropagation();
									e.preventDefault();
									onTab( e );
								}
							}
						} }
					>
						<FieldContent />
					</div>
				</section>
			) }
		</div>
	);
};
export default FieldWrapper;

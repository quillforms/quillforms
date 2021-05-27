/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
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

	function processTab( e, isShiftPressed ) {
		e.preventDefault();
		if ( isAnimating ) {
			return;
		}
		let activeElement = document.activeElement;
		console.log( activeElement );
		const focusableElements = getFocusables( `#block-${ id }` );

		//outside the block? Let's not hijack the tab!
		if ( ! isFocused ) {
			return;
		}

		const activeElementIndex = findIndex(
			focusableElements,
			( el ) => el === activeElement
		);

		// Happens when the active element is in the next block or previous block
		// This case occurs when pressing tab multiple times at the same time.
		if ( activeElementIndex === -1 ) {
			return;
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
						null &&
					// If document element is still in dom
					// One example for this case is  the next button in each block if the block isn't valid and the error message
					// appear instead of the button. The button is focusable but it is no longer in dom.
					document.contains(
						focusableElements[ activeElementIndex + 1 ]
					)
				) {
					focusableElements[ activeElementIndex + 1 ].focus();
				} else {
					//when reached the last focusable element of the block, go next
					goNext();
				}
			}
		} else {
			//when reached the first  focusable element of the block, go prev if shift is pressed
			if ( activeElementIndex === 0 ) {
				goPrev();
			} else {
				if ( activeElementIndex === -1 ) {
					document.body.focus();
				} else {
					focusableElements[ activeElementIndex - 1 ].focus();
				}
			}
		}

		return;
	}

	/**
	 * Makes sure the tab key will only focus elements within the current block  preventing this way from breaking the page.
	 * Otherwise, go next or prev.
	 */
	function onTab( e, isShiftPressed ) {
		clearTimeout( tabTimer );
		if ( isAnimating ) return;
		tabTimer = setTimeout( () => {
			processTab( e, isShiftPressed );
		}, 150 );
	}

	return (
		<div
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
							const isShiftPressed = e.shiftKey;
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
									onTab( e, isShiftPressed );
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

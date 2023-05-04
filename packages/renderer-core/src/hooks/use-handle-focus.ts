/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { useSelect } from '@wordpress/data';

let focusTimer;
const useHandleFocus = (
	inputRef,
	isActive: boolean,
	isTouchScreen: boolean
) => {
	const { isAnimating, currentBlockId } = useSelect( ( select ) => {
		return {
			isAnimating: select( 'quillForms/renderer-core' ).isAnimating(),
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );

	const { isFocused } = useSelect( ( select ) => {
		return {
			isFocused: select( 'quillForms/renderer-core' ).isFocused(),
		};
	} );

	const isVisible = ( ref ) => {
		if ( ! ref?.current ) return false;
		const current = ref?.current?.inputElement
			? ref.current.inputElement
			: ref.current;
		const rect = (
			findDOMNode( current ) as Element
		 )?.getBoundingClientRect();

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <=
				( window.innerHeight ||
					document.documentElement
						.clientHeight ) /* or $(window).height() */ &&
			rect.right <=
				( window.innerWidth ||
					document.documentElement
						.clientWidth ) /* or $(window).width() */
		);
	};

	useEffect( () => {
		if ( ! isTouchScreen && isFocused && isActive && ! isAnimating ) {
			if ( isVisible( inputRef ) ) {
				focusTimer = setTimeout( () => {
					if ( inputRef?.current?.focus ) {
						inputRef.current.focus();
					} else if ( inputRef?.current?.inputElement?.focus ) {
						inputRef.current.inputElement.focus();
					}
				}, 30 );
			} else if ( currentBlockId ) {
				const el = document?.querySelector(
					`#block-${ currentBlockId } .renderer-components-field-wrapper__content-wrapper`
				) as HTMLElement;

				focusTimer = setTimeout( () => {
					if ( document.activeElement !== el ) el.focus();
				}, 50 );
			}
		}
	}, [ isFocused, isActive, isAnimating ] );

	useEffect( () => {
		if ( ! isActive ) {
			clearTimeout( focusTimer );
		}
		if (
			inputRef?.current?.blur &&
			! isActive &&
			document.activeElement === inputRef.current
		) {
			inputRef.current.blur();
		}
	}, [ inputRef, isActive ] );
};

export default useHandleFocus;

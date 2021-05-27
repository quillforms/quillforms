import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

let focusTimer;
const useHandleFocus = ( inputRef, isFocused, isActive, isTouchDevice ) => {
	// const { isVisible } = useVisibilitySensor( inputRef, {
	// 	intervalCheck: false,
	// 	scrollCheck: true,
	// 	resizeCheck: true,
	// } );
	const { isAnimating, currentBlockId } = useSelect( ( select ) => {
		return {
			isAnimating: select( 'quillForms/renderer-core' ).isAnimating(),
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );
	useEffect( () => {
		if (
			! isTouchDevice &&
			isFocused &&
			isActive &&
			! isAnimating
			// isVisible &&
		) {
			focusTimer = setTimeout( () => {
				if ( inputRef?.current?.focus ) {
					inputRef.current.focus();
				} else {
					if (
						currentBlockId &&
						document?.querySelector(
							`#block-${ currentBlockId } .renderer-components-field-wrapper__content-wrapper`
						)
					)
						document
							.querySelector(
								`#block-${ currentBlockId } .renderer-components-field-wrapper__content-wrapper`
							)
							.focus();
				}
			}, 150 );
		}
	}, [ isFocused, isActive, isAnimating ] );

	useEffect( () => {
		if ( ! isActive ) clearTimeout( focusTimer );
		if (
			inputRef?.current?.blur &&
			! isActive &&
			document.activeElement === inputRef.current
		) {
			console.log( blur );
			inputRef.current.blur();
		}
	}, [ inputRef, isActive ] );
};

export default useHandleFocus;

/**
 * WordPress Dependencies
 */
import { useEffect, useCallback } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import useFormContext from './use-form-context';

let focusTimer: ReturnType<typeof setTimeout>;

const useHandleFocus = (
	inputRef: React.RefObject<any>,
	isActive: boolean,
	isTouchScreen: boolean
) => {
	const formContext = useFormContext();
	if (formContext.editor.mode === 'on') return;
	const { isAnimating, currentBlockId } = useSelect((select) => {
		return {
			isAnimating: select('quillForms/renderer-core').isAnimating(),
			currentBlockId: select('quillForms/renderer-core').getCurrentBlockId(),
		};
	});

	const { isFocused } = useSelect((select) => {
		return {
			isFocused: select('quillForms/renderer-core').isFocused(),
		};
	});

	const isVisible = useCallback((ref: React.RefObject<any>) => {
		if (!ref?.current) return false;

		const element = ref.current.inputElement || ref.current;
		if (!element) return false;

		// Use native Element.getBoundingClientRect() directly on the element
		const rect = element.getBoundingClientRect();
		const viewHeight = window.innerHeight || document.documentElement.clientHeight;
		const viewWidth = window.innerWidth || document.documentElement.clientWidth;

		return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= viewHeight &&
			rect.right <= viewWidth
		);
	}, []);

	useEffect(() => {
		if (!isTouchScreen && isFocused && isActive && !isAnimating) {
			if (isVisible(inputRef)) {
				focusTimer = setTimeout(() => {
					const element = inputRef?.current;
					if (element?.focus) {
						element.focus();
					} else if (element?.inputElement?.focus) {
						element.inputElement.focus();
					}
				}, 30);
			} else if (currentBlockId) {
				const el = document?.querySelector(
					`#block-${currentBlockId} .renderer-components-field-wrapper__content-wrapper`
				) as HTMLElement;

				focusTimer = setTimeout(() => {
					if (document.activeElement !== el) el.focus();
				}, 50);
			}
		}
	}, [isFocused, isActive, isAnimating, isTouchScreen, currentBlockId, inputRef, isVisible]);

	useEffect(() => {
		if (!isActive) {
			clearTimeout(focusTimer);
		}

		const element = inputRef?.current;
		if (
			element?.blur &&
			!isActive &&
			document.activeElement === element
		) {
			element.blur();
		}
	}, [inputRef, isActive]);
};

export default useHandleFocus;
/**
 * QuillForms dependencies
 */
import { BlockAttributes } from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { createContext, useContext, useMemo } from '@wordpress/element';

/**
 * External Dependencies
 */
import { noop } from 'lodash';

interface FieldRenderContext {
	id: string | undefined;
	blockName: string | undefined;
	attributes: BlockAttributes | undefined;
	shouldBeRendered: boolean;
	isActive: boolean;
	isSubmitBtnVisible: boolean;
	isErrMsgVisible: boolean;
	showSubmitBtn: ( x: boolean ) => void;
	showErrMsg: ( x: boolean ) => void;
	next: () => void;
	isFocused: boolean;
	isLastField: boolean;
	setIsFocused: ( x: boolean ) => void;
}
const Context = createContext< FieldRenderContext >( {
	id: undefined,
	blockName: undefined,
	attributes: undefined,
	isActive: false,
	shouldBeRendered: false,
	isSubmitBtnVisible: false,
	isErrMsgVisible: false,
	showErrMsg: noop,
	showSubmitBtn: noop,
	next: noop,
	isFocused: false,
	isLastField: false,
	setIsFocused: noop,
} );
const { Provider } = Context;

export const FieldRenderContextProvider = ( { value, children } ) => {
	return (
		<Provider value={ useMemo( () => value, Object.values( value ) ) }>
			{ children }
		</Provider>
	);
};

/**
 * A hook that returns the block render context.
 *
 * @return {Object} Block render context
 */
export function useFieldRenderContext(): FieldRenderContext {
	return useContext( Context );
}

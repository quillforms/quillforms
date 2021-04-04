/**
 * WordPress dependencies
 */
import { BlockAttributes } from '@quillforms/config';
import { createContext, useContext, useMemo } from '@wordpress/element';
import { noop } from 'lodash';
interface FieldRenderContext {
	id: string | undefined;
	blockName: string | undefined;
	attributes: BlockAttributes | undefined;
	shouldBeRendered: boolean;
	isActive: boolean;
	blockFooterArea: undefined | 'error-message' | 'submit-btn';
	setBlockFooterArea: (
		x: undefined | 'error-message' | 'submit-btn'
	) => void;
	next: () => void;
	isFocused: boolean;
}
const Context = createContext< FieldRenderContext >( {
	id: undefined,
	blockName: undefined,
	attributes: undefined,
	isActive: false,
	shouldBeRendered: false,
	blockFooterArea: undefined,
	setBlockFooterArea: noop,
	next: noop,
	isFocused: false,
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

/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';

const Context = createContext( {
	id: undefined,
	type: undefined,
	attributes: undefined,
	title: undefined,
	required: undefined,
	description: undefined,
	attachment: undefined,
	counter: 1,
	isAnimating: false,
	isActive: false,
} );
const { Provider } = Context;

export { Provider as FieldRenderContextProvider };

/**
 * A hook that returns the block render context.
 *
 * @return {Object} Block render context
 */
export function useFieldRenderContext() {
	return useContext( Context );
}

/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';

const Context = createContext( {
	type: '',
	isSelected: false,
	blockId: null,
	attributes: [],
} );
const { Provider } = Context;

export { Provider as BlockRenderContextProvider };

/**
 * A hook that returns the block render context.
 *
 * @return {Object} Block render context
 */
export function useBlockRenderContext() {
	return useContext( Context );
}

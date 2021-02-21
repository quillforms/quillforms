/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';

const Context = createContext( {
	addChoice: noop,
	labelChangeHandler: noop,
	scoreChangeHandler: noop,
	deleteChoice: noop,
} );
const { Provider } = Context;

export { Provider as ChoiceContextProvider };

/**
 * A hook that returns the choice context.
 *
 * @return {Object} Choice context
 */
export function useChoiceContext() {
	return useContext( Context );
}

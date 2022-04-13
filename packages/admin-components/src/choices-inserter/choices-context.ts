/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';

/**
 * Internal Dependencies
 */
import type { ChoicesContextContent } from './types';

const Context = createContext< ChoicesContextContent >( {
	addChoice: noop,
	labelChangeHandler: noop,
	deleteChoice: noop,
	handleMediaUpload: noop,
	deleteImageHandler: noop,
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

/**
 * WordPress dependencies
 */
import { createContext, useContext } from '@wordpress/element';
import { noop } from 'lodash';
import { useMemo } from '@wordpress/element';

const Context = createContext( {
	onEntryClick: noop,
	setSelectedEntries: noop,
	selectedEntries: [],
	activeEntryId: undefined,
	selectedField: undefined,
} );

const EntryRowContextProvider = ({ children, value }) => {
	const memoizedValue = useMemo(() => value, Object.values(value));

	return (
		<Context.Provider value={memoizedValue}>
			{children}
		</Context.Provider>
	);
};

export { EntryRowContextProvider };

/**
 * A hook that returns the choice context.
 *
 * @return {Object} Choice context
 */
export function useEntryRowContext() {
	return useContext( Context );
}

/**
 * WordPress Dependencies
 */
import React, { createContext, useContext } from '@wordpress/element';

const MergeTagsContext = createContext( {} );

const MergeTagsContextProvider = ( { children, value } ) => {
	return (
		<MergeTagsContext.Provider value={ value }>
			{ children }
		</MergeTagsContext.Provider>
	);
};

const useMergeTagsContext = () => useContext( MergeTagsContext );

export { MergeTagsContext, MergeTagsContextProvider, useMergeTagsContext };

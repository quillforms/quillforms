/**
 * WordPress Dependencies
 */
import React, { createContext, useContext, useMemo } from '@wordpress/element';

const PreviewContext = createContext( {} );

const PreviewContextProvider = ( { children, value } ) => {
	const memoizedValue = useMemo( () => value, Object.values( value ) );

	return (
		<PreviewContext.Provider value={ memoizedValue }>
			{ children }
		</PreviewContext.Provider>
	);
};

const usePreviewContext = () => useContext( PreviewContext );

export { PreviewContext, PreviewContextProvider, usePreviewContext };

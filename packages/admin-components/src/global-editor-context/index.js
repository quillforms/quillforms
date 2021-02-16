/**
 * WordPress Dependencies
 */
import React, { createContext, useContext } from '@wordpress/element';

const GlobalEditorContext = createContext( {} );

const GlobalEditorContextProvider = ( { children, value } ) => {
	return (
		<GlobalEditorContext.Provider value={ value }>
			{ children }
		</GlobalEditorContext.Provider>
	);
};

const useGlobalEditorContext = () => useContext( GlobalEditorContext );

GlobalEditorContextProvider.defaultProps = {
	fonts: {},
	schemas: {},
	maxUploadSize: '',
};

export {
	GlobalEditorContext,
	GlobalEditorContextProvider,
	useGlobalEditorContext,
};

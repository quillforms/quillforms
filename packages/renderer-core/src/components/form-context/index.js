/**
 * WordPress Dependencies
 */
import React, { createContext, useMemo } from '@wordpress/element';
import { noop } from 'lodash';

const FormContext = createContext( {} );

const FormContextProvider = ( { children, value } ) => {
	const memoizedValue = useMemo( () => value, Object.values( value ) );

	return (
		<FormContext.Provider value={ memoizedValue }>
			{ children }
		</FormContext.Provider>
	);
};
FormContextProvider.defaultProps = {
	value: {
		formObj: {
			blocks: [],
			messages: {},
			theme: {},
			logic: null,
		},
		onSubmit: noop,
	},
};

export { FormContext, FormContextProvider };

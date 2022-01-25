/**
 * WordPress Dependencies
 */
import React, { createContext, useMemo } from '@wordpress/element';
import { noop } from 'lodash';
import { FormObj } from '../../types';

interface FormContext {
	formObj: FormObj;
	onSubmit: () => void;
	isPreview: boolean;
	formId?: number;
}
const FormContext = createContext< FormContext >( {
	formObj: {
		blocks: [],
		messages: {},
		themeId: undefined,
		logic: undefined,
		themesList: [],
		settings: {
			disableProgressBar: false,
		},
	},
	onSubmit: noop,
	isPreview: false,
} );

const FormContextProvider = ( { children, value } ) => {
	const memoizedValue = useMemo( () => value, Object.values( value ) );

	return (
		<FormContext.Provider value={ memoizedValue }>
			{ children }
		</FormContext.Provider>
	);
};

export { FormContext, FormContextProvider };

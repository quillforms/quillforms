/**
 * WordPress Dependencies
 */
import { createContext, useMemo } from '@wordpress/element';
import { noop } from 'lodash';
import { FormObj, SubmissionDispatchers } from '../../types';

interface FormContext {
	formObj: FormObj;
	onSubmit: ( data: object, dispatchers: SubmissionDispatchers ) => void;
	isPreview: boolean;
	formId?: number;
	setBlocks: ( blocks: FormObj[ 'blocks' ] ) => void;
}
const FormContext = createContext< FormContext >( {
	formObj: {
		blocks: [],
		messages: {},
		theme: {},
		logic: undefined,
		themesList: [],
		settings: {
			disableProgressBar: false,
			disableWheelSwiping: false,
			animationDirection: 'vertical',
		},
		hiddenFields: {},
	},
	onSubmit: noop,
	isPreview: false,
	setBlocks: noop,
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

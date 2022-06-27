/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import type { ComboboxControlValue, Options, Sections } from '.';

const ComboboxControlContext = createContext< {
	sections: Sections;
	options: Options;
	value: ComboboxControlValue;
	onChange: ( value: ComboboxControlValue ) => void;
	isToggleEnabled: boolean;
	placeholder?: string;
} >( {
	sections: [],
	options: [],
	value: {},
	onChange: ( {} ) => {},
	isToggleEnabled: true,
} );

const { Provider } = ComboboxControlContext;

export { Provider as ComboboxControlContextProvider };

const useComboboxControlContext = () =>
	useContext( ComboboxControlContext );

export { ComboboxControlContext, useComboboxControlContext };

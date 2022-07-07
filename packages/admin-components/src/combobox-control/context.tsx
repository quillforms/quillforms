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
	excerptLength?: number;
} >( {
	sections: [],
	options: [],
	value: {},
	onChange: ( {} ) => {},
	isToggleEnabled: true,
	excerptLength: 30,
} );

const { Provider } = ComboboxControlContext;

export { Provider as ComboboxControlContextProvider };

const useComboboxControlContext = () => useContext( ComboboxControlContext );

export { ComboboxControlContext, useComboboxControlContext };

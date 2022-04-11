/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import type { MappingValue, Options, Sections } from '.';

const MappingValueControlContext = createContext< {
	sections: Sections;
	options: Options;
	value: MappingValue;
	onChange: ( value: MappingValue ) => void;
	isToggleEnabled: boolean;
	placeholder?: string;
} >( {
	sections: [],
	options: [],
	value: {},
	onChange: ( {} ) => {},
	isToggleEnabled: true,
} );

const { Provider } = MappingValueControlContext;

export { Provider as MappingValueControlContextProvider };

const useMappingValueControlContext = () =>
	useContext( MappingValueControlContext );

export { MappingValueControlContext, useMappingValueControlContext };

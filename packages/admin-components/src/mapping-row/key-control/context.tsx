/**
 * WordPress Dependencies
 */
import { createContext, useContext } from 'react';

const MappingKeyControlContext = createContext< {
	value: string;
	onChange: ( value: string ) => void;
	disabled?: boolean;
} >( {
	value: '',
	onChange: ( _value ) => {},
	disabled: false,
} );

const { Provider } = MappingKeyControlContext;

export { Provider as MappingKeyControlContextProvider };

const useMappingKeyControlContext = () =>
	useContext( MappingKeyControlContext );

export { MappingKeyControlContext, useMappingKeyControlContext };

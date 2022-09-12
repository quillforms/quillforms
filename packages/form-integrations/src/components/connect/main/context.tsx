/**
 * WordPress Dependencies
 */
import { createContext, useContext } from 'react';

/**
 * Internal Dependencies
 */
import { ConnectMain } from '../../types';

const EmptyOptions: React.FC< { connectionId: string } > = ( {} ) => {
	return <div></div>;
};

const ConnectMainContext = createContext< ConnectMain >( {
	connection: {
		options: {
			default: {},
			Component: EmptyOptions,
			validate: ( _options ) => ( { valid: true } ),
		},
	},
} );

const ConnectMainContextProvider = ConnectMainContext.Provider;
const useConnectMainContext = () => useContext( ConnectMainContext );

export {
	ConnectMainContext,
	ConnectMainContextProvider,
	useConnectMainContext,
};

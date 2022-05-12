/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { Main } from '../../types';

const EmptyOptions: React.FC< { connectionId: string } > = ( {} ) => {
	return <div></div>;
};

const ConnectMainContext = createContext< Main >( {
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

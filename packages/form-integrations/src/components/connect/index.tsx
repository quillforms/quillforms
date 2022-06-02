/**
 * QuillForms Dependencies.
 */
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useReducer, useRef } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import type { ConnectMain, Provider, Setup as SetupType } from '../types';
import reducer, { State } from './state/reducer';
import actions from './state/actions';
import { ConnectContextProvider } from './state/context';
import Setup from './setup';
import Main from './main';
import PrepareState from './utils/PrepareState';

interface Props {
	provider: Provider;
	setup?: SetupType;
	main: ConnectMain;
	close: () => void;
}

const Connect: React.FC< Props > = ( { provider, setup, main, close } ) => {
	const payload = ConfigAPI.getInitialPayload()?.addons?.[ provider.slug ];
	const [ state, dispatch ] = useReducer(
		reducer,
		PrepareState( payload, main.connection.options.default )
	);
	const { app, accounts, connections } = state;
	const stateRef = useRef< State >( state );
	stateRef.current = state;
	const $actions = actions( dispatch );

	// update payload.
	const updatePayload = ( key: string, value: any ) => {
		ConfigAPI.setInitialPayload( {
			...ConfigAPI.getInitialPayload(),
			addons: {
				...ConfigAPI.getInitialPayload()?.addons,
				[ provider.slug ]: {
					...payload,
					[ key ]: value,
				},
			},
		} );
	};
	// save payload from state.
	const savePayload = ( key: string ) => {
		updatePayload( key, stateRef.current[ key ] );
	};

	// check if need setup.
	let needSetup = false;
	if ( setup ) {
		for ( const [ key, field ] of Object.entries( setup.fields ) ) {
			if ( field.check && ! app[ key ] ) {
				needSetup = true;
				break;
			}
		}
	}

	return (
		<div className="integration-connect">
			<ConnectContextProvider
				value={ {
					provider,
					accounts,
					connections,
					...$actions,
					updatePayload,
					savePayload,
				} }
			>
				{ setup && needSetup ? (
					<Setup setup={ setup } close={ close } />
				) : (
					<Main main={ main } close={ close } />
				) }
			</ConnectContextProvider>
		</div>
	);
};

export default Connect;

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useReducer } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import Loader from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import { Provider, SettingsMain, Setup as SetupType } from '../types';
import reducer from './state/reducer';
import actions from './state/actions';
import { SettingsContextProvider } from './state/context';
import Setup from './setup';
import { Accounts, App } from './state/types';
import Main from './main';

interface Props {
	provider: Provider;
	setup?: SetupType;
	main: SettingsMain;
}

const Settings: React.FC< Props > = ( { provider, setup, main } ) => {
	const [ state, dispatch ] = useReducer( reducer, {
		app: {},
		accounts: {},
	} );
	const { app, accounts } = state;
	const $actions = actions( dispatch );
	const [ loadStatus, setLoadStatus ] = useState( 'loading' );

	useEffect( () => {
		( async () => {
			try {
				// load app if has setup.
				if ( setup ) {
					const res = ( await apiFetch( {
						path: `/qf/v1/addons/${ provider.slug }/settings/`,
						method: 'GET',
					} ) ) as { app: App };
					if ( res.app && ! Array.isArray( res.app ) ) {
						$actions.setupApp( res.app );
					}
				}

				// load accounts.
				const res = ( await apiFetch( {
					path: `/qf/v1/addons/${ provider.slug }/accounts/`,
					method: 'GET',
				} ) ) as Accounts;
				if ( !Array.isArray( res ) ) {
					$actions.setupAccounts( res );
				}

				setLoadStatus( 'loaded' );
			} catch ( err ) {
				console.error( err );
				setLoadStatus( 'failed' );
			}
		} )();
	}, [] );

	// if loading.
	if ( loadStatus === 'loading' ) {
		return (
			<div className="integration-settings">
				<div className="integration-settings__loading">
					<Loader
						type="ThreeDots"
						color="#8640e3"
						height={ 50 }
						width={ 50 }
					/>
				</div>
			</div>
		);
	} else if ( loadStatus === 'failed' ) {
		// if load failed.
		<div className="integration-settings">
			Error on loading settings, please refresh the page.
		</div>;
	}

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
		<div className="integration-settings">
			<SettingsContextProvider
				value={ {
					provider,
					setup,
					app,
					accounts,
					...$actions,
				} }
			>
				{ setup && needSetup ? <Setup /> : <Main main={ main } /> }
			</SettingsContextProvider>
		</div>
	);
};

export default Settings;

/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import Loader from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import { useSettingsContext } from '../../state/context';

const App: React.FC = () => {
	// context.
	const {
		provider,
		setup,
		app,
		setupApp,
		setupAccounts,
	} = useSettingsContext();

	// state.
	const [ disconnectModal, setDisconnectModal ] = useState( false );
	const [ disconnecting, setDisconnecting ] = useState( false );

	// alerts dispatch.
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	// for ts. won't be reached normally.
	if ( ! setup ) return null;

	let $field: any = false;
	for ( const [ id, field ] of Object.entries( setup.fields ) ) {
		if ( field.check ) {
			$field = {
				label: field.label,
				value: app[ id ] ?? '',
			};
		}
	}

	const disconnect = () => {
		if ( disconnecting ) return;
		setDisconnecting( true );
		apiFetch( {
			path: `/qf/v1/addons/${ provider.slug }/settings`,
			method: 'DELETE',
			parse: false,
		} )
			.then( () => {
				createSuccessNotice( '✅ App deleted successfully!', {
					type: 'snackbar',
					isDismissible: true,
				} );
				setDisconnecting( false );
				setDisconnectModal( false );
				setupApp( {} );
				setupAccounts( {} );
			} )
			.catch( ( err ) => {
				createErrorNotice(
					err.message
						? `⛔ ${ err.message }`
						: '⛔ Error on disconnecting the app!',
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
				setDisconnecting( false );
			} );
	};

	return (
		<div className="integration-settings-main-app">
			<b>App Settings:</b>
			<div className="integration-settings-main-app__content">
				<div>
					{ $field && (
						<>
							{ $field.label }:{ ' ' }
							<span style={ { wordBreak: 'break-all' } }>
								{ $field.value }
							</span>
						</>
					) }
				</div>
				<Button isDanger onClick={ () => setDisconnectModal( true ) }>
					Disconnect App
				</Button>
			</div>
			{ disconnectModal && (
				<Modal
					className="integration-settings-main-app__disconnect-modal"
					shouldCloseOnClickOutside={ false }
					title="Warning!"
					onRequestClose={ () =>
						! disconnecting && setDisconnectModal( false )
					}
				>
					<div>
						<div>
							Are you sure you want to delete the app settings{ ' ' }
							<b>with all accounts and related connections</b>?
						</div>
						<br />
						<div>Are you sure you want to proceed?</div>
					</div>
					<div className="integration-settings-main-app__disconnect-modal-buttons">
						<Button
							isDefault
							isLarge
							className="integration-settings-main-app__disconnect-modal-buttons-cancel"
							onClick={ () => setDisconnectModal( false ) }
							disabled={ disconnecting }
						>
							Cancel
						</Button>
						<Button
							isDanger
							isLarge
							onClick={ disconnect }
							disabled={ disconnecting }
						>
							{ disconnecting ? (
								<>
									Disconnecting{ ' ' }
									<Loader
										className="integration-settings-main-app__disconnect-modal-buttons-submit-loader"
										type="TailSpin"
										color="#fff"
										height={ 16 }
										width={ 16 }
									/>
								</>
							) : (
								<>Disconnect</>
							) }
						</Button>
					</div>
				</Modal>
			) }
		</div>
	);
};

export default App;

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
import { TailSpin as Loader } from 'react-loader-spinner';

/**
 * Internal Dependencies
 */
import { useSettingsContext } from '../../state/context';
import { SettingsMainAccounts } from '../../../types';

interface Props {
	data: SettingsMainAccounts;
}

const Accounts: React.FC< Props > = ( { data } ) => {
	// context.
	const { provider, accounts, deleteAccount } = useSettingsContext();

	// state.
	const [ disconnectModal, setDisconnectModal ] = useState< null | string >(
		null
	);
	const [ disconnecting, setDisconnecting ] = useState( false );

	// alerts dispatch.
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	const disconnect = ( id: string ) => {
		if ( disconnecting ) return;
		setDisconnecting( true );
		apiFetch( {
			path: `/qf/v1/addons/${ provider.slug }/accounts/${ id }`,
			method: 'DELETE',
			parse: false,
		} )
			.then( () => {
				createSuccessNotice(
					'✅ ' +
						( data.labels?.singular ?? 'Account' ) +
						' deleted successfully!',
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
				setDisconnecting( false );
				setDisconnectModal( null );
				deleteAccount( id );
			} )
			.catch( ( err ) => {
				createErrorNotice(
					err.message
						? `⛔ ${ err.message }`
						: '⛔ Error on delete the ' +
								( data.labels?.singular?.toLowerCase() ??
									'account' ),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
				setDisconnecting( false );
			} );
	};

	return (
		<div className="integration-settings-main-accounts">
			<b>{ data.labels?.plural ?? 'Accounts' }:</b>
			<div className="integration-settings-main-accounts__list">
				{ Object.keys( accounts ).length === 0 ? (
					<div>
						No authenticated{ ' ' }
						{ data.labels?.plural?.toLowerCase() ?? 'accounts' } yet
					</div>
				) : (
					Object.entries( accounts ).map( ( [ id, account ] ) => {
						return (
							<div
								key={ id }
								className="integration-settings-main-accounts__list-account"
							>
								<div>{ account.name }</div>
								<div className="integration-settings-main-accounts__list-account-actions">
									{ data.actions &&
										data.actions.map( ( Action, index ) => (
											<Action
												key={ index }
												accountId={ id }
											/>
										) ) }
									<Button
										isDanger
										onClick={ () =>
											setDisconnectModal( id )
										}
									>
										Disconnect
									</Button>
								</div>
							</div>
						);
					} )
				) }
			</div>
			{ disconnectModal && (
				<Modal
					className="integration-settings-main-accounts__disconnect-modal"
					shouldCloseOnClickOutside={ false }
					title="Warning!"
					onRequestClose={ () =>
						! disconnecting && setDisconnectModal( null )
					}
				>
					<div>
						Are you sure you want to delete{ ' ' }
						{ data.labels?.singular?.toLowerCase() ?? 'account' }{ ' ' }
						{ accounts[ disconnectModal ].name } ? All of related
						connections on forms will be deleted also.
					</div>
					<br />
					<div>Are you sure you want to proceed?</div>
					<div className="integration-settings-main-accounts__disconnect-modal-buttons">
						<Button
							isDefault
							isLarge
							className="integration-settings-main-accounts__disconnect-modal-buttons-cancel"
							onClick={ () => setDisconnectModal( null ) }
							disabled={ disconnecting }
						>
							Cancel
						</Button>
						<Button
							isDanger
							isLarge
							onClick={ () => disconnect( disconnectModal ) }
							disabled={ disconnecting }
						>
							{ disconnecting ? (
								<>
									Disconnecting{ ' ' }
									<Loader
										wrapperClass="integration-settings-main-accounts__disconnect-modal-buttons-submit-loader"
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

export default Accounts;

/**
 * QuillForms Dependencies.
 */
import ConfigApi from '@quillforms/config';
import {
	Button,
	LogicConditions,
	TextControl,
	ToggleControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import AccountSelect from './account-select';
import RunIcon from './run-icon';
import DeleteIcon from './delete-icon';
import { useConnectContext } from '../../state/context';
import { useConnectMainContext } from '../context';

interface Props {
	id: string;
	run: () => void;
}

const Connection: React.FC< Props > = ( { id, run } ) => {
	const { accounts, connections, updateConnection, deleteConnection } =
		useConnectContext();
	const connection = connections[ id ];
	const main = useConnectMainContext();
	const entriesAddon = ConfigApi.getStoreAddons()[ 'entries' ];
	// check if active & version is >= 1.4.0.
	const isEntriesCompatible =
		entriesAddon.is_active &&
		parseInt( entriesAddon?.version?.split( '.' )?.[ 1 ] ?? '0', 10 ) >= 4;

	return (
		<div className="integration-connection">
			<div className="connection-header-buttons">
				{ isEntriesCompatible && (
					<Button className="connection-run" onClick={ run }>
						<span>{ __( 'Run Connection', 'quillforms' ) }</span>
						<RunIcon />
					</Button>
				) }
				<Button
					className="connection-delete"
					onClick={ () => deleteConnection( id ) }
				>
					<span>{ __( 'Delete Connection', 'quillforms' ) }</span>
					<DeleteIcon />
				</Button>
			</div>
			<div className="connection-header">
				<TextControl
					className="connection-primary-control"
					label={ __( 'Connection Name', 'quillforms' ) }
					value={ connection.name }
					onChange={ ( value ) =>
						updateConnection( id, { name: value } )
					}
				/>
			</div>
			{ main.connection.accounts && (
				<AccountSelect connectionId={ id } />
			) }
			{ main.connection.accounts ? (
				connection.account_id ? (
					accounts[ connection.account_id ] ? (
						<main.connection.options.Component
							connectionId={ id }
						/>
					) : (
						<div className="error">
							{ __(
								"Previously selected account isn't found, please reauthorize it or select another one!",
								'quillforms'
							) }
						</div>
					)
				) : null
			) : (
				<main.connection.options.Component connectionId={ id } />
			) }
			<div className="connection-section connection-conditions">
				<div className="connection-section-label">
					Conditional Logic
				</div>
				<div>
					<ToggleControl
						checked={ !! connection.conditions }
						onChange={ () => {
							if ( connection.conditions ) {
								updateConnection(
									id,
									{ conditions: undefined },
									false
								);
							} else {
								updateConnection(
									id,
									{
										// @ts-ignore, will updated instantly to default empty conditions.
										conditions: [],
									},
									false
								);
							}
						} }
					/>{ ' ' }
					Enable
				</div>
				{ !! connection.conditions && (
					<div>
						<div className="conditions-instructions">
							Process this connection if the following conditions
							are met:
						</div>
						<LogicConditions
							value={ connection.conditions }
							onChange={ ( value ) =>
								updateConnection(
									id,
									// @ts-ignore
									{ conditions: value },
									false
								)
							}
						/>
					</div>
				) }
			</div>
		</div>
	);
};

export default Connection;

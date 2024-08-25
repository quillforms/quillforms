/* eslint-disable no-nested-ternary */
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
import { Tooltip, RadioControl } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

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
	const entriesAddon = ConfigApi.getStoreAddons().entries;
	// check if active & version is >= 1.4.0.
	const isEntriesCompatible =
		entriesAddon.is_active &&
		( parseInt( entriesAddon?.version?.split( '.' )?.[ 1 ] ?? '0', 10 ) >=
			4 ||
			parseInt( entriesAddon?.version?.split( '.' )?.[ 0 ] ?? '0', 10 ) >=
				2 );
	const runable = main.connection.runable ?? true;

	return (
		<div className="integration-connection">
			<div className="connection-header-buttons">
				{ isEntriesCompatible && runable && (
					<Tooltip
						text={
							'Use this option if you would like to test your connection or to run the connection for some entries manually.'
						}
						position="bottom center"
					>
						<Button className="connection-run" onClick={ run }>
							<span>{ __( 'Run Manually', 'quillforms' ) }</span>
							<RunIcon />
						</Button>
					</Tooltip>
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
				<div
					className={ css`
						padding: 10px;
						margin-bottom: 16px;
					` }
				>
					<RadioControl
						label={ __( 'Run Connection after:', 'quillforms' ) }
						selected={ connection.run_type || 'submission' }
						options={ [
							{
								label: __( 'Submission', 'quillforms' ),
								value: 'submission',
							},
							{
								label: __( 'Save', 'quillforms' ),
								value: 'save',
							},
						] }
						onChange={ ( value ) => {
							updateConnection( id, { run_type: value } );
						} }
					/>
				</div>
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
				// eslint-disable-next-line no-nested-ternary
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

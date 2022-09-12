/**
 * QuillForms Dependencies.
 */
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
import DeleteIcon from './delete-icon';
import { useConnectContext } from '../../state/context';
import { useConnectMainContext } from '../context';

interface Props {
	id: string;
}

const Connection: React.FC< Props > = ( { id } ) => {
	const {
		accounts,
		connections,
		updateConnection,
		deleteConnection,
	} = useConnectContext();
	const connection = connections[ id ];
	const main = useConnectMainContext();

	return (
		<div className="integration-connection">
			<Button
				className="connection-delete"
				onClick={ () => deleteConnection( id ) }
			>
				{ __( 'Delete Connection', 'quillforms' ) }
				<DeleteIcon />
			</Button>
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

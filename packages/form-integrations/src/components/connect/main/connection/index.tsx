/**
 * QuillForms Dependencies.
 */
import { Button, TextControl } from '@quillforms/admin-components';

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
		</div>
	);
};

export default Connection;

/**
 * QuillForms Dependencies
 */
import { TextControl, Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { useConnectMainContext } from '../../../context';
import { useConnectContext } from '../../../../state/context';
import { Account } from '../../../../state/types';

interface Props {
	adding: boolean;
	onAdding: ( status: boolean ) => void;
	onAdded: ( id: string, account: Account ) => void;
}

const AuthCredentials: React.FC< Props > = ( {
	adding,
	onAdding,
	onAdded,
} ) => {
	// context.
	const { provider } = useConnectContext();
	const main = useConnectMainContext();
	const fields = main.connection.accounts?.auth.fields ?? {
		api_key: { label: provider.label + ' API Key', type: 'text' },
	};

	// state.
	const [ inputs, setInputs ] = useState( {} );

	// dispatch notices.
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	// submit.
	const submit = () => {
		onAdding( true );
		apiFetch( {
			path: `/qf/v1/addons/${ provider.slug }/accounts`,
			method: 'POST',
			data: {
				credentials: inputs,
			},
		} )
			.then( ( res: any ) => {
				createSuccessNotice(
					'✅ ' + __( 'Account added successfully!', 'quillforms' ),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
				onAdded( res.id, { name: res.name } );
			} )
			.catch( ( err ) => {
				createErrorNotice(
					'⛔ ' +
						( err.message ??
							__(
								'Error in adding the account!',
								'quillforms'
							) ),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
			} )
			.finally( () => onAdding( false ) );
	};

	let inputsFilled = true;
	for ( const key of Object.keys( fields ) ) {
		if ( ! inputs[ key ] ) {
			inputsFilled = false;
			break;
		}
	}

	return (
		<div className="integration-connect-auth-credentials">
			{ Object.entries( fields ).map( ( [ key, field ] ) => (
				<TextControl
					key={ key }
					label={ field.label }
					value={ inputs[ key ] }
					onChange={ ( value ) =>
						setInputs( { ...inputs, [ key ]: value } )
					}
					disabled={ adding }
				/>
			) ) }
			<Button
				isPrimary
				onClick={ submit }
				disabled={ ! inputsFilled || adding }
			>
				{ __( 'Add', 'quillforms-hubspot' ) }
			</Button>
		</div>
	);
};

export default AuthCredentials;

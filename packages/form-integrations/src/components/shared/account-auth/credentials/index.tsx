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
import { AccountsAuthFields, Provider } from '../../../types';

interface Props {
	provider: Provider;
	onAdding?: ( status: boolean ) => void;
	onAdded: ( id: string, account: { name: string } ) => void;
	fields?: AccountsAuthFields;
}

const Credentials: React.FC< Props > = ( {
	provider,
	onAdding,
	onAdded,
	fields,
} ) => {
	fields = fields ?? {
		api_key: { label: provider.label + ' API Key', type: 'text' },
	};

	// state.
	const [ inputs, setInputs ] = useState( {} );
	const [ submitting, setSubmitting ] = useState( false );

	// dispatch notices.
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	// submit.
	const submit = () => {
		setSubmitting( true );
		if ( onAdding ) onAdding( true );
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
				setInputs( {} );
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
			.finally( () => {
				setSubmitting( false );
				if ( onAdding ) onAdding( false );
			} );
	};

	let inputsFilled = true;
	for ( const key of Object.keys( fields ) ) {
		if ( ! inputs[ key ] ) {
			inputsFilled = false;
			break;
		}
	}

	return (
		<div className="integration-auth-credentials">
			{ Object.entries( fields ).map( ( [ key, field ] ) => (
				<TextControl
					key={ key }
					label={ field.label }
					value={ inputs[ key ] ?? '' }
					onChange={ ( value ) =>
						setInputs( { ...inputs, [ key ]: value } )
					}
					disabled={ submitting }
				/>
			) ) }
			<Button
				isPrimary
				onClick={ submit }
				disabled={ ! inputsFilled || submitting }
			>
				{ __( 'Add', 'quillforms-hubspot' ) }
			</Button>
		</div>
	);
};

export default Credentials;

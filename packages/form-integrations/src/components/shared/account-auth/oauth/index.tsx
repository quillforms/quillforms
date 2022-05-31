/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import { Provider } from '../../../types';

interface Props {
	provider: Provider;
	onAdded: ( id: string, account: { name: string } ) => void;
}

const Oauth: React.FC< Props > = ( { provider, onAdded } ) => {
	// dispatch notices.
	const { createSuccessNotice } = useDispatch( 'core/notices' );

	const authorize = () => {
		window[ `add_new_${ provider.slug }_account` ] = (
			id: string,
			name: string
		) => {
			createSuccessNotice(
				'✅ ' +
					__( 'Account added successfully!', 'quillforms-hubspot' ),
				{
					type: 'snackbar',
					isDismissible: true,
				}
			);
			onAdded( id, { name } );
		};
		window.open(
			`${ window[ 'qfAdmin' ].adminUrl }admin.php?quillforms-${ provider.slug }=authorize`,
			'authorize',
			'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=500,left=100,top=100'
		);
	};

	return (
		<div className="integration-auth-oauth">
			<Button isPrimary onClick={ authorize }>
				Authorize Your Account
			</Button>
		</div>
	);
};

export default Oauth;

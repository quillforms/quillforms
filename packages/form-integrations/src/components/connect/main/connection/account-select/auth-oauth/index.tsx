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
import { useConnectContext } from '../../../../state/context';
import { Account } from '../../../../state/types';

interface Props {
	onAdded: ( id: string, account: Account ) => void;
}

const AddNewAccount: React.FC< Props > = ( { onAdded } ) => {
	// context.
	const { provider } = useConnectContext();

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
		<div className="integration-connect-auth-oauth">
			<Button isPrimary onClick={ authorize }>
				Authorize Your Account
			</Button>
		</div>
	);
};

export default AddNewAccount;

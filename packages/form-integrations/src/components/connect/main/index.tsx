/**
 * QuillForms Dependencies
 */
import { useParams } from '@quillforms/navigation';
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { Icon, plusCircle } from '@wordpress/icons';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { cloneDeep } from 'lodash';

/**
 * Internal Dependencies
 */
import { useConnectContext } from '../state/context';
import Connection from './connection';
import WarningIcon from './warning-icon';
import Footer from '../footer';
import type { ConnectMain } from '../../types';
import { ConnectMainContextProvider } from './context';

interface Props {
	main: ConnectMain;
	close: () => void;
}

const Main: React.FC< Props > = ( { main, close } ) => {
	const formId = useParams().id;

	// context.
	const {
		provider,
		accounts,
		connections,
		addConnection,
		savePayload,
	} = useConnectContext();

	// state.
	const [ isSubmitting, setIsSubmitting ] = useState( false );

	// dispatch notices.
	const { createSuccessNotice, createErrorNotice } = useDispatch(
		'core/notices'
	);

	const save = () => {
		// check validity.
		if ( ! validate() ) {
			return;
		}

		// submit.
		setIsSubmitting( true );
		apiFetch( {
			path: `/qf/v1/forms/${ formId }/addons/${ provider.slug }`,
			method: 'POST',
			data: { connections },
		} )
			.then( () => {
				createSuccessNotice(
					'✅ ' + __( 'updated successfully!', 'quillforms' ),
					{
						type: 'snackbar',
						isDismissible: true,
					}
				);
				savePayload( 'connections' );
				setTimeout( close );
			} )
			.catch( ( err ) => {
				error( err.message ?? __( 'Error on saving!', 'quillforms' ) );
			} )
			.finally( () => {
				setIsSubmitting( false );
			} );
	};

	const error = ( message ) => {
		createErrorNotice( '⛔ ' + message, {
			type: 'snackbar',
			isDismissible: true,
		} );
	};

	const validate = () => {
		for ( const connection of Object.values( connections ) ) {
			if ( ! connection.name ) {
				error( 'Connection name cannot be empty' );
				return false;
			}
			if ( main.connection.accounts && ! connection.account_id ) {
				error(
					`"${ connection.name }" error: please select an account`
				);
				return false;
			}
			if ( main.connection.options.validate ) {
				const account =
					accounts?.[ connection.account_id ?? 0 ] ?? undefined;
				const result = main.connection.options.validate( {
					connection,
					account,
				} );
				if ( ! result.valid ) {
					error(
						`"${ connection.name }" error: ` + result.message ??
							'invalid options'
					);
					return false;
				}
			}
		}
		return true;
	};

	const randomId = () => Math.random().toString( 36 ).substr( 2, 9 );

	return (
		<div className="integration-connect-main">
			<ConnectMainContextProvider value={ main }>
				<div className="integration-connect-main__body">
					{ Object.keys( connections ).length ? (
						Object.keys( connections ).map( ( id ) => (
							<Connection key={ id } id={ id } />
						) )
					) : (
						<div className="integration-connect-main__warning">
							<WarningIcon />
							<div>
								{ __(
									"You don't have any connections!",
									'quillforms'
								) }
							</div>
						</div>
					) }

					<div>
						<Button
							className="integration-connect-main__add-connection"
							isPrimary
							onClick={ () =>
								addConnection( randomId(), {
									name: __( 'New Connection', 'quillforms' ),
									...cloneDeep(
										main.connection.options.default
									),
								} )
							}
						>
							<Icon icon={ plusCircle } />
							{ __( 'Add A New Connection', 'quillforms' ) }
						</Button>
					</div>
				</div>
				<Footer
					save={ {
						label: __( 'Save', 'quillforms' ),
						onClick: save,
						disabled: isSubmitting,
					} }
					close={ {
						label: __( 'Cancel', 'quillforms' ),
						onClick: close,
					} }
				/>
			</ConnectMainContextProvider>
		</div>
	);
};

export default Main;

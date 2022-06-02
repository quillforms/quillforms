/**
 * QuillForms Dependencies.
 */
import { TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * Internal Dependencies
 */
import type { Provider, SetupFields } from '../../types';

interface Props {
	provider: Provider;
	Instructions: React.FC;
	fields: SetupFields;
	Controls: React.FC< { submit: () => void } >;
	onFinish: ( app: any ) => void;
}

const Setup: React.FC< Props > = ( {
	provider,
	Instructions,
	fields,
	Controls,
	onFinish,
} ) => {
	const [ inputs, setInputs ] = useState( {} );

	const submit = () => {
		apiFetch( {
			path: `/qf/v1/addons/${ provider.slug }/settings`,
			method: 'POST',
			data: {
				app: inputs,
			},
		} )
			.then( () => {
				const app = {};
				for ( const [ key, field ] of Object.entries( fields ) ) {
					if ( field.check ) {
						app[ key ] = inputs[ key ];
					}
				}
				onFinish( app );
			} )
			.catch( ( err ) => {
				console.log( 'Error: ', err );
			} );
	};

	return (
		<div className="integration-setup">
			<div className="integration-setup__body">
				<div className="integration-setup__instructions">
					<Instructions />
				</div>

				{ Object.entries( fields ).map( ( [ key, field ] ) => (
					<TextControl
						key={ key }
						label={ field.label }
						value={ inputs[ key ] ?? '' }
						onChange={ ( value ) =>
							setInputs( { ...inputs, [ key ]: value } )
						}
					/>
				) ) }
			</div>

			<Controls submit={ submit } />
		</div>
	);
};

export default Setup;

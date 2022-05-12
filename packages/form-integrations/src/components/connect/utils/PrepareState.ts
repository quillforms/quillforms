/**
 * External Dependencies
 */
import { cloneDeep } from 'lodash';

const PrepareState = ( payload: any, connectionOptions: any ) => {
	const app = isObject( payload?.app ) ? cloneDeep( payload?.app ) : {};
	const accounts = isObject( payload?.accounts )
		? cloneDeep( payload?.accounts )
		: {};
	const connections = isObject( payload?.connections )
		? ( cloneDeep( payload?.connections ) as { [ id: string ]: any } )
		: {};

	// add a default connection if they are empty.
	if ( Object.keys( connections ).length === 0 ) {
		connections[ 'initial' ] = {
			name: 'Connection #1',
			...cloneDeep( connectionOptions ),
		};
	}

	// fix empty arrays that meant to be empty objects.
	//  is it better to be handled at backend by force cast before json encode (object)?
	for ( const [ id, connection ] of Object.entries( connections ) ) {
		for ( const key in connectionOptions ) {
			if (
				isObject( connectionOptions[ key ] ) &&
				Array.isArray( connection[ key ] ) &&
				connection[ key ].length === 0
			) {
				connections[ id ][ key ] = {};
			}
		}
	}

	return {
		app,
		accounts,
		connections,
	};
};

const isObject = ( variable: unknown ): boolean => {
	return (
		typeof variable === 'object' &&
		variable !== null &&
		! Array.isArray( variable )
	);
};

export default PrepareState;

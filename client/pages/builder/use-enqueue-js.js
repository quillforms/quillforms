import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const useEnqueueJS = ( handle ) => {
	const [ assetsLoading, setAssetsLoading ] = useState( true );
	useEffect( () => {
		const loadedScriptsHandles = Array.prototype.slice
			.call( document.getElementsByTagName( 'script' ) )
			.map( ( script ) => script.id.trim() )
			.filter( ( script ) => !! script );
		apiFetch( {
			path: `/__experimental/scripts?dependency=${ handle }`,
			method: 'GET',
		} ).then( ( res ) => {
			if ( res ) {
				res.forEach( ( element ) => {
					const script = document.createElement( 'script' );

					script.src = 'https://use.typekit.net/foobar.js';
					document.body.appendChild( script );
				} );
			}
			const head = document.head;
			const link = document.createElement( 'link' );

			link.type = 'text/css';
			link.rel = 'stylesheet';
			// link.href = stylePath;

			head.appendChild( link );

			setAssetsLoading( false );
		} );
	}, [] );

	return [ assetsLoading ];
};

export default useEnqueueJS;

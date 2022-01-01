import { useRef, useEffect } from '@wordpress/element';

interface ObjectDict {
	[ index: string ]: any;
}

function useTraceUpdate( props: any ) {
	const prev = useRef( props );
	useEffect( () => {
		const changedProps = Object.entries( props ).reduce(
			( lookup: ObjectDict, [ key, value ] ) => {
				if ( prev.current[ key ] !== value ) {
					lookup[ key ] = [ prev.current[ key ], value ];
				}
				return lookup;
			},
			{}
		);
		if ( Object.keys( changedProps ).length > 0 ) {
			console.log( 'Changed props:', changedProps );
		}
		prev.current = props;
	} );
}

export default useTraceUpdate;

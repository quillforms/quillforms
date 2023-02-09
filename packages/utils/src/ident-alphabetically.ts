// Simple algorithm to generate alphabatical idented order
const identAlphabetically = ( index: number ) => {
	const charCode = 'a'.charCodeAt( 0 );

	const identName = ( a: number ): string => {
		const b = [ a ];
		let sp, out, i, div;

		sp = 0;
		while ( sp < b.length ) {
			if ( b[ sp ] > 25 ) {
				div = Math.floor( b[ sp ] / 26 );
				b[ sp + 1 ] = div - 1;
				b[ sp ] %= 26;
			}
			sp += 1;
		}

		out = '';
		for ( i = 0; i < b.length; i += 1 ) {
			out = String.fromCharCode( charCode + b[ i ] ) + out;
		}

		return out.toUpperCase();
	};
	return identName( index );
};

export default identAlphabetically;

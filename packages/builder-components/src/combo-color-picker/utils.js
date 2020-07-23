/**
 * External Dependencies
 */
import tinycolor from 'tinycolor2';
import gradientParser from 'gradient-parser';

/**
 *
 * @param {string} value The value to check.
 *
 * @return { boolean } Is the received color gradient or not
 */
export const isGradient = ( value ) => {
	let hasGradient = !! value;

	try {
		gradientParser.parse( value );
	} catch ( error ) {
		hasGradient = false;
	}
	return hasGradient;
};

/**
 * @param {Object|string} data A hex color string or an object with a hex property
 * @return { boolean } Is the received color solid or not
 */
export const isSolid = ( data = {} ) => {
	const tinyColorObj = data.hex ? tinycolor( data.hex ) : tinycolor( data );
	if ( tinyColorObj._format ) return true;
	return false;
};

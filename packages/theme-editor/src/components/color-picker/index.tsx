/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import ColorPalette from '../color-palette';

const ColorPicker = ( { value, onChange } ) => {
	const colors = [
		{
			name: __( 'Pale pink' ),
			slug: 'pale-pink',
			color: 'rgba(247, 141, 167, 1)',
		},
		{
			name: __( 'Vivid red' ),
			slug: 'vivid-red',
			color: 'rgba(207, 46, 46, 1)',
		},
		{
			name: __( 'Luminous vivid orange' ),
			slug: 'luminous-vivid-orange',
			color: 'rgba(255, 105, 0, 1)',
		},
		{
			name: __( 'Luminous vivid amber' ),
			slug: 'luminous-vivid-amber',
			color: 'rgba(252, 185, 0, 1)',
		},
		{
			name: __( 'Light green cyan' ),
			slug: 'light-green-cyan',
			color: 'rgba(123, 220, 181, 1)',
		},
		{
			name: __( 'Vivid green cyan' ),
			slug: 'vivid-green-cyan',
			color: 'rgba(0, 208, 132, 1)',
		},
		{
			name: __( 'Pale cyan blue' ),
			slug: 'pale-cyan-blue',
			color: 'rgba(142, 209, 252, 1)',
		},
		{
			name: __( 'Vivid cyan blue' ),
			slug: 'vivid-cyan-blue',
			color: 'rgba(6, 147, 227, 1)',
		},
		{
			name: __( 'Vivid purple' ),
			slug: 'vivid-purple',
			color: 'rgba(155, 81, 224, 1)',
		},
		{
			name: __( 'Dark Magenta' ),
			slug: 'dark-magenta',
			color: 'rgba(139, 0, 139, 1)',
		},
		{
			name: __( 'Cyan bluish gray' ),
			slug: 'cyan-bluish-gray',
			color: 'rgba(171, 184, 195, 1)',
		},
		{
			name: __( 'Very dark gray' ),
			slug: 'very-dark-gray',
			color: 'rgba(49, 49, 49, 1)',
		},
	];
	function hexToRgb( hex ) {
		if ( /^#[0-9A-F]{6}$/i.test( hex ) ) {
			var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
				hex
			);
			return {
				r: parseInt( result[ 1 ], 16 ),
				g: parseInt( result[ 2 ], 16 ),
				b: parseInt( result[ 3 ], 16 ),
			};
		}
		return hex;
	}
	return (
		<div className="admin-components-color-picker">
			<ColorPalette
				colors={ colors }
				value={ value }
				onChange={ ( val ) => {
					// If is hex
					if (
						typeof val === 'object' ||
						/^#[0-9A-F]{6}$/i.test( val )
					) {
						const rgbVal = hexToRgb( val );

						const rgbaValue = `rgba(${ rgbVal.r }, ${ rgbVal.g }, ${
							rgbVal.b
						}, ${ rgbVal.a !== undefined ? rgbVal.a : 1 })`;
						onChange( rgbaValue );
					} else {
						onChange( val );
					}
				} }
			/>
		</div>
	);
};
export default ColorPicker;

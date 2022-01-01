/**
 * External dependencies
 */
import { map } from 'lodash';
import tinycolor from 'tinycolor2';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { useCallback, useMemo } from '@wordpress/element';
import { ColorPicker } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import CircularOptionPicker from '../circular-option-picker';

export default function ColorPalette( {
	clearable = true,
	className,
	colors,
	disableCustomColors = false,
	onChange,
	value,
} ) {
	const clearColor = useCallback( () => onChange( undefined ), [ onChange ] );
	const colorOptions = useMemo( () => {
		return map( colors, ( { color, name } ) => {
			return (
				<CircularOptionPicker.Option
					key={ color }
					isSelected={ value === color }
					selectedIconProps={
						value === color
							? {
									fill: tinycolor
										.mostReadable( color, [
											'#000',
											'#fff',
										] )
										.toRgbString(),
							  }
							: {}
					}
					tooltipText={
						name ||
						// translators: %s: color hex code e.g: "#f00".
						sprintf( __( 'Color code: %s' ), color )
					}
					style={ { backgroundColor: color, color } }
					onClick={
						value === color ? clearColor : () => onChange( color )
					}
					aria-label={
						name
							? // translators: %s: The name of the color e.g: "vivid red".
							  sprintf( __( 'Color: %s' ), name )
							: // translators: %s: color hex code e.g: "#f00".
							  sprintf( __( 'Color code: %s' ), color )
					}
				/>
			);
		} );
	}, [ colors, value, onChange, clearColor ] );
	const renderCustomColorPicker = () => (
		<ColorPicker
			color={ value }
			onChangeComplete={ ( color ) => {
				onChange( color.rgb );
			} }
			disableAlpha={ false }
		/>
	);

	return (
		<CircularOptionPicker
			className={ className }
			options={ colorOptions }
			actions={
				<>
					{ ! disableCustomColors && (
						<CircularOptionPicker.DropdownLinkAction
							dropdownProps={ {
								renderContent: renderCustomColorPicker,
								contentClassName:
									'components-color-palette__picker',
							} }
							buttonProps={ {
								'aria-label': __( 'Custom color picker' ),
							} }
							linkText={ __( 'Custom color' ) }
						/>
					) }
					{ !! clearable && (
						<CircularOptionPicker.ButtonAction
							onClick={ clearColor }
						>
							{ __( 'Clear' ) }
						</CircularOptionPicker.ButtonAction>
					) }
				</>
			}
		/>
	);
}

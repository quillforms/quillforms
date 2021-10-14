/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	ToggleControl,
	TextControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

const NumberControls = ( props ) => {
	const {
		attributes: { setMin, min, setMax, max },
		setAttributes,
	} = props;
	const MAX_NUMBER = 999999999;

	const setMinHandler = ( val ) => {
		let assignedValue = val;
		if ( assignedValue < 0 ) assignedValue = 0;
		if ( setMax && max && assignedValue > max ) assignedValue = max;
		setAttributes( {
			min: assignedValue,
		} );
	};

	const setMaxHandler = ( val ) => {
		let assignedValue = val;
		if ( assignedValue < 1 ) assignedValue = 1;
		if ( setMin && min && assignedValue < min ) assignedValue = min;
		setAttributes( {
			max: assignedValue,
		} );
	};
	return (
		<Fragment>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Set min number" />
					<ToggleControl
						checked={ setMin }
						onChange={ () => {
							setAttributes( { setMin: ! setMin } );
							setMaxHandler( 1 );
						} }
					/>
				</ControlWrapper>
				{ setMin && (
					<TextControl
						type="number"
						placeholder={
							'0-' + ( setMax && max ? max : MAX_NUMBER )
						}
						value={ min }
						onChange={ ( val ) => setAttributes( { min: val } ) }
						onBlur={ () => setMinHandler( min ) }
					/>
				) }
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Set max number" />
					<div role="presentation" className="switch-control-wrapper">
						<ToggleControl
							checked={ setMax }
							onChange={ () => {
								setAttributes( { setMax: ! setMax } );
								setMaxHandler( 1 );
							} }
						/>
					</div>
				</ControlWrapper>
				{ setMax && (
					<TextControl
						type="number"
						placeholder={
							'' + ( setMin && min ? min : 1 ) + '-' + MAX_NUMBER
						}
						value={ max }
						onChange={ ( val ) => setAttributes( { max: val } ) }
						onBlur={ () => setMaxHandler( max ) }
					/>
				) }
			</BaseControl>
		</Fragment>
	);
};
export default NumberControls;

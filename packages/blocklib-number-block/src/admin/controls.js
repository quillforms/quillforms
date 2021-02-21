/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
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
		else if ( assignedValue > MAX_NUMBER ) assignedValue = MAX_NUMBER;
		if ( setMax && max && assignedValue > max ) assignedValue = max;
		setAttributes( {
			min: assignedValue,
		} );
	};

	const setMaxHandler = ( val ) => {
		let assignedValue = val;
		if ( assignedValue < 1 ) assignedValue = 1;
		else if ( assignedValue > MAX_NUMBER ) assignedValue = MAX_NUMBER;
		if ( setMin && min && assignedValue < min ) assignedValue = min;
		setAttributes( {
			max: assignedValue,
		} );
	};
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Set min number" />
					<div
						role="presentation"
						className="switch-control-wrapper"
						onClick={ () => {
							setAttributes( { setMin: ! setMin } );
							setMinHandler( 0 );
						} }
					>
						<ToggleControl checked={ setMin } />
					</div>
				</__experimentalControlWrapper>
				{ setMin && (
					<TextControl
						type="number"
						placeholder={
							'0-' + ( setMax && max ? max : MAX_NUMBER )
						}
						value={ min }
						onChange={ ( e ) =>
							setAttributes( { min: e.target.value } )
						}
						onBlur={ () => setMinHandler( min ) }
					/>
				) }
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Set max number" />
					<div
						role="presentation"
						className="switch-control-wrapper"
						onClick={ () => {
							setAttributes( { setMax: ! setMax } );
							setMaxHandler( 1 );
						} }
					>
						<ToggleControl checked={ setMax } />
					</div>
				</__experimentalControlWrapper>
				{ setMax && (
					<TextControl
						type="number"
						placeholder={
							'' + ( setMin && min ? min : 1 ) + '-' + MAX_NUMBER
						}
						value={ max }
						onChange={ ( e ) =>
							setAttributes( { max: e.target.value } )
						}
						onBlur={ () => setMaxHandler( max ) }
					/>
				) }
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default NumberControls;

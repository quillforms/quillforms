/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * External Dependencies
 */
import Input from '@material-ui/core/Input';

const NumberControls = ( props ) => {
	const {
		attributes: { setMin, min, setMax, max },
		setAttributes,
	} = props;
	const MAX_NUMBER = 999999999;
	const setMinHandler = ( e ) => {
		let assignedValue = e.target.value;

		if ( assignedValue < 0 ) assignedValue = 0;
		else if ( assignedValue > MAX_NUMBER ) assignedValue = MAX_NUMBER;
		if ( setMax && max ) {
			if ( assignedValue > max ) assignedValue = max;
		}
		setAttributes( {
			min: assignedValue,
		} );
	};
	const setMaxHandler = ( e ) => {
		let assignedValue = e.target.value;
		if ( assignedValue < 1 ) assignedValue = 1;
		else if ( assignedValue > MAX_NUMBER ) assignedValue = MAX_NUMBER;
		if ( setMin && min ) {
			if ( assignedValue < min ) assignedValue = min;
		}
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
						role="button"
						tabIndex="-1"
						className="switch-control-wrapper"
						onMouseDown={ () =>
							setAttributes( { setMin: ! setMin } )
						}
					>
						<ToggleControl checked={ setMin } />
					</div>
				</__experimentalControlWrapper>
				{ setMin && (
					<div className="block-text-input-wrapper">
						<Input
							inputProps={ {
								max: setMax && max ? min : 1,
								min: '0',
							} }
							type="number"
							placeholder={
								'0-' + ( setMax && max ? max : MAX_NUMBER )
							}
							value={ min }
							onChange={ ( e ) =>
								setAttributes( { min: e.target.value } )
							}
							onBlur={ setMinHandler }
						/>
					</div>
				) }
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Set max number" />
					<div
						role="button"
						tabIndex="-1"
						className="switch-control-wrapper"
						onMouseDown={ () =>
							setAttributes( { setMax: ! setMax } )
						}
					>
						<ToggleControl checked={ setMax } />
					</div>
				</__experimentalControlWrapper>
				{ setMax && (
					<div className="block-text-input-wrapper">
						<Input
							inputProps={ {
								min: setMin && min ? min : 1,
								max: MAX_NUMBER,
							} }
							type="number"
							placeholder={
								'' +
								( setMin && min ? min : 1 ) +
								'-' +
								MAX_NUMBER
							}
							value={ max }
							onChange={ ( e ) =>
								setAttributes( { max: e.target.value } )
							}
							onBlur={ setMaxHandler }
						/>
					</div>
				) }
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default NumberControls;

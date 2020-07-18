import { useState, useRef, useEffect } from '@wordpress/element';
import {
	EditableInput,
	Saturation,
	Hue,
} from 'react-color/lib/components/common';
import { CirclePicker } from 'react-color';
const ColorPicker = ( props ) => {
	const { color } = props;
	const [ showPicker, setShowPicker ] = useState( false );
	const ref = useRef();
	const handleClickOutside = ( e ) => {
		if ( ref.current && ! ref.current.contains( e.target ) ) {
			setShowPicker( false );
		}
	};

	// Attaching the previous event with UseEffect hook
	useEffect( () => {
		// Bind the event listener
		document.addEventListener( 'mousedown', handleClickOutside );
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener( 'mousedown', handleClickOutside );
		};
	} );

	return (
		<div className="color__pickerWrapper" ref={ ref }>
			<button
				className="color__pickerBtn"
				onClick={ () => setShowPicker( ! showPicker ) }
				style={ { background: color } }
			>
				<span className="color__pickerResult__Text">Select Color</span>
			</button>
			{ showPicker && (
				<div className="color__picker">
					<div className="saturation__wrapper">
						<Saturation { ...props } onChange={ props.onChange } />
					</div>
					<div className="hue__wrapper">
						<Hue
							{ ...props }
							color={ color.hex }
							onChange={ props.onChange }
						/>
					</div>
					<div className="editable__inputWrapper">
						<span
							className="color-previewSquare"
							style={ { backgroundColor: props.hex } }
						/>
						<EditableInput
							className="editable__input"
							value={ props.hex }
							onChange={ props.onChange }
						/>
					</div>
					<CirclePicker
						color={ color }
						onChange={ props.onChange }
						colors={ [
							'#F44336',
							'#E91E63',
							'#9C27B0',
							'#673AB7',
							'#3F51B5',
							'#2196F3',
							'#03A9F4',
							'#00BCD4',
							'#009688',
							'#4CAF50',
							'#8BC34A',
							'#CDDC39',
							'#FFEB3B',
							'#FFC107',
							'#FF9800',
						] }
					/>
				</div>
			) }
		</div>
	);
};
export default ColorPicker;

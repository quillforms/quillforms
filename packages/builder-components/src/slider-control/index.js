/**
 * WordPress Dependencies
 */
import { useRef, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import Slider from '@material-ui/core/Slider';
import Tooltip from '../tooltip';

const SliderControl = ( props ) => {
	return (
		<Slider
			ValueLabelComponent={ ValueLabelComponent }
			aria-label="custom thumb label"
			{ ...props }
		/>
	);
};
const ValueLabelComponent = ( props ) => {
	const { children, open, value } = props;

	const popperRef = useRef( null );

	useEffect( () => {
		if ( popperRef.current ) {
			popperRef.current.update();
		}
	} );

	return (
		<Tooltip
			PopperProps={ {
				popperRef,
			} }
			open={ open }
			enterTouchDelay={ 0 }
			placement="top"
			title={ value }
		>
			{ children }
		</Tooltip>
	);
};

export default SliderControl;

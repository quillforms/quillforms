import { RangeControl } from '@wordpress/components';
const MeasureControl = ( { val, onChange } ) => {
	return (
		<RangeControl
			color="#b2328c"
			trackColor="#b2328c"
			railColor="#e2e8f0"
			value={ val }
			onChange={ ( value ) => onChange( value ) }
			min={ 10 }
			max={ 80 }
		/>
	);
};
export default MeasureControl;

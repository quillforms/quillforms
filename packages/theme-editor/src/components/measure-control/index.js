import { RangeControl } from '@wordpress/components';
const MeasureControl = ( { val, onChange } ) => {
	return (
		<RangeControl
			value={ val }
			onChange={ ( value ) => onChange( value ) }
			min={ 10 }
			max={ 80 }
		/>
	);
};
export default MeasureControl;

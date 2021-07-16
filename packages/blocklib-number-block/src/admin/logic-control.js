import { TextControl } from '@quillforms/admin-components';
import { useEffect, useState } from '@wordpress/element';

const NumberLogicControl = ( { value, setValue } ) => {
	const [ controlVal, setControlVal ] = useState( value );
	useEffect( () => {
		setValue( parseInt( controlVal, 10 ) );
	}, [ controlVal ] );
	return (
		<TextControl
			type="number"
			value={ value }
			onChange={ ( val ) => setControlVal( val ) }
		/>
	);
};

export default NumberLogicControl;

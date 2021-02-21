import { TextControl } from '@quillforms/admin-components';
import { useEffect, useState } from '@wordpress/element';

const NumberLogicControl = ( { value, setValue } ) => {
	const [ controlVal, setControlVal ] = useState( 0 );
	useEffect( () => {
		setValue( parseInt( controlVal ) );
	}, [ controlVal ] );
	return (
		<TextControl
			type="number"
			value={ value }
			setValue={ ( val ) => setControlVal( val ) }
		/>
	);
};

export default NumberLogicControl;

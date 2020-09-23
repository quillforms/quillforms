/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlLabel,
	__experimentalControlWrapper,
	TextControl,
} from '@quillforms/builder-components';
import { useEffect } from '@wordpress/element';
import AlertMessageWrapper from '../alert-message-wrapper';

const EmailSubject = ( {
	value,
	setValue,
	isValid,
	setIsValid,
	isReviewing,
} ) => {
	useEffect( () => {
		if ( value && value.length > 0 ) {
			setIsValid( true );
		} else {
			setIsValid( false );
		}
	}, [ value ] );
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel
					label="Subject"
					showAsterisk={ true }
				/>
				<TextControl
					value={ value }
					setValue={ ( newVal ) => setValue( newVal ) }
				/>
			</__experimentalControlWrapper>
			{ ! isValid && isReviewing && (
				<AlertMessageWrapper type="error">
					This field is required!
				</AlertMessageWrapper>
			) }
		</__experimentalBaseControl>
	);
};
export default EmailSubject;

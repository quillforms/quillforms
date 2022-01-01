/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlLabel,
	ControlWrapper,
	TextControl,
} from '@quillforms/admin-components';
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
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Subject" showAsterisk={ true } />
				<TextControl
					value={ value }
					onChange={ ( newVal ) => setValue( newVal ) }
				/>
				{ ! isValid && isReviewing && (
					<AlertMessageWrapper type="error">
						This field is required!
					</AlertMessageWrapper>
				) }
			</ControlWrapper>
		</BaseControl>
	);
};
export default EmailSubject;

/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlLabel,
	__experimentalControlWrapper,
	TextControl,
} from '@quillforms/builder-components';

const EmailSubject = ( { value, setValue } ) => {
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Subject" />
				<TextControl
					value={ value }
					setValue={ ( newVal ) => setValue( newVal ) }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default EmailSubject;

/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	TextControl,
} from '@quillforms/admin-components';

const WelcomeScreenControls = ( { attributes, setAttributes } ) => {
	// const { attributes, setAttributes } = props;
	const { buttonText } = attributes;
	const handleChange = ( event ) => {
		setAttributes( { buttonText: event.target.value } );
	};
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Button Text" />
				<TextControl
					value={ buttonText }
					onChange={ ( val ) => setAttributes( { buttonText: val } ) }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default WelcomeScreenControls;

/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
	TextControl,
} from '@quillforms/admin-components';

const WelcomeScreenControls = ( { attributes, setAttributes } ) => {
	// const { attributes, setAttributes } = props;
	const { buttonText } = attributes;
	const handleChange = ( event ) => {
		setAttributes( { buttonText: event.target.value } );
	};
	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Button Text" />
				<TextControl
					value={ buttonText }
					onChange={ ( val ) => setAttributes( { buttonText: val } ) }
				/>
			</ControlWrapper>
		</BaseControl>
	);
};
export default WelcomeScreenControls;

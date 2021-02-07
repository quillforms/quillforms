/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	Button,
	ChoicesBulkBtn,
	ChoicesInserter,
} from '@quillforms/builder-components';

/**
 * WordPress Dependecies
 */
import { Fragment } from '@wordpress/element';

const DropdownControls = ( props ) => {
	const {
		attributes: { choices },
		setAttributes,
	} = props;

	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Choices" />
					<ChoicesBulkBtn
						choices={ choices }
						setChoices={ ( val ) => {
							setAttributes( { choices: val } );
						} }
					/>
				</__experimentalControlWrapper>
				<__experimentalControlWrapper orientation="vertical">
					<ChoicesInserter
						choices={ choices }
						setChoices={ ( val ) => {
							setAttributes( { choices: val } );
						} }
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
		</Fragment>
	);
};
export default DropdownControls;

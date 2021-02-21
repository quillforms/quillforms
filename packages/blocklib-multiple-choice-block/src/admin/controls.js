/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
	ChoicesBulkBtn,
	ChoicesInserter,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

const multipleChoiceControls = ( props ) => {
	const {
		attributes: { multiple, verticalAlign, choices },
		setAttributes,
	} = props;
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Multiple" />
					<ToggleControl
						checked={ multiple }
						onChange={ () =>
							setAttributes( { multiple: ! multiple } )
						}
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Vertical Align" />
					<ToggleControl
						checked={ verticalAlign }
						onChange={ () =>
							setAttributes( { verticalAlign: ! verticalAlign } )
						}
					/>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>
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
export default multipleChoiceControls;

/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlWrapper,
	ControlLabel,
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
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Multiple" />
					<ToggleControl
						checked={ multiple }
						onChange={ () =>
							setAttributes( { multiple: ! multiple } )
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Vertical Align" />
					<ToggleControl
						checked={ verticalAlign }
						onChange={ () =>
							setAttributes( { verticalAlign: ! verticalAlign } )
						}
					/>
				</ControlWrapper>
			</BaseControl>
			<BaseControl>
				<ControlWrapper orientation="horizontal">
					<ControlLabel label="Choices" />
					<ChoicesBulkBtn
						choices={ choices }
						setChoices={ ( val ) => {
							setAttributes( { choices: val } );
						} }
					/>
				</ControlWrapper>
				<ControlWrapper orientation="vertical">
					<ChoicesInserter
						choices={ choices }
						setChoices={ ( val ) => {
							setAttributes( { choices: val } );
						} }
					/>
				</ControlWrapper>
			</BaseControl>
		</Fragment>
	);
};
export default multipleChoiceControls;

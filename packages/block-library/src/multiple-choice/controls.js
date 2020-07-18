/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	ToggleControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import DropdownControls from '../dropdown/controls';

const multipleChoiceControls = ( props ) => {
	const {
		attributes: { multiple, verticalAlign },
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
			<DropdownControls { ...props } />
		</Fragment>
	);
};
export default multipleChoiceControls;

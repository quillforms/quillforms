/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
 import { CustomSelectControl } from "@wordpress/components";
/**
 * External Dependencies
 */
import { css } from 'emotion';

const DateControls = ( props ) => {
	const {
		attributes: { format, separator },
		setAttributes,
	} = props;
	const formatOptions = [{
		key: "MMDDYYYY",
		name: "MMDDYYYY"
	}, 
	{
		key: "DDMMYYYY",
		name: "DDMMYYYY"
	}, {

		key: "YYYYMMDD",
		name: "YYYYMMDD"
	}];
	const separatorOptions = [{
		key: "/",
		value: "/"
	},
	{
		key: "-",
		value: "-"
	},
	{
		key: ".",
		value: "."
	},
	]
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Date Format" />

				<CustomSelectControl
					className={ css`
						margin-top: 5px;
					` }
					onChange={ ( selectedChoice ) =>
						setAttributes( { format: selectedChoice } )
					}
					options={formatOptions}
					value={ formatOptions.find( ( option ) => option.key === format ) }

				/>
				<CustomSelectControl
					className={ css`
						margin-top: 10px;
					` }
					value={ separatorOptions.find( ( option ) => option.key === separator) }
					onChange={ ( selectedChoice ) =>
						setAttributes( { separator: selectedChoice } )
					}
					options={separatorOptions}
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default DateControls;

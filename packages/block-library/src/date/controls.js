/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/builder-components';

/**
 * External Dependencies
 */
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const DateControls = ( props ) => {
	const {
		attributes: { format, separator },
		setAttributes,
	} = props;
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Date Format" />

				<div className="select-control-wrapper">
					<Select
						value={ format }
						onChange={ ( e ) =>
							setAttributes( { format: e.target.value } )
						}
					>
						<MenuItem value={ 'MMDDYYYY' }>MMDDYYYY</MenuItem>
						<MenuItem value={ 'DDMMYYYY' }>DDMMYYYY</MenuItem>
						<MenuItem value={ 'YYYYMMDD' }>YYYYMMDD</MenuItem>
					</Select>
				</div>
				<div className="select-control-wrapper">
					<Select
						value={ separator }
						onChange={ ( e ) =>
							setAttributes( { separator: e.target.value } )
						}
					>
						<MenuItem value={ '/' }>/</MenuItem>
						<MenuItem value={ '-' }>-</MenuItem>
						<MenuItem value={ '.' }>.</MenuItem>
					</Select>
				</div>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default DateControls;

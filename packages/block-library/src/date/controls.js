/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	SelectControl,
	MenuItem,
} from '@quillforms/builder-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DateControls = ( props ) => {
	const {
		attributes: { format, separator },
		setAttributes,
	} = props;
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Date Format" />

				<SelectControl
					className={ css`
						margin-top: 5px;
					` }
					value={ format }
					onChange={ ( e ) =>
						setAttributes( { format: e.target.value } )
					}
				>
					<MenuItem value={ 'MMDDYYYY' }>MMDDYYYY</MenuItem>
					<MenuItem value={ 'DDMMYYYY' }>DDMMYYYY</MenuItem>
					<MenuItem value={ 'YYYYMMDD' }>YYYYMMDD</MenuItem>
				</SelectControl>
				<SelectControl
					className={ css`
						margin-top: 10px;
					` }
					value={ separator }
					onChange={ ( e ) =>
						setAttributes( { separator: e.target.value } )
					}
				>
					<MenuItem value={ '/' }>/</MenuItem>
					<MenuItem value={ '-' }>-</MenuItem>
					<MenuItem value={ '.' }>.</MenuItem>
				</SelectControl>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default DateControls;

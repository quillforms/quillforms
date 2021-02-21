/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	SelectControl,
} from '@quillforms/admin-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DateControls = ( props ) => {
	const {
		attributes: { format, separator },
		setAttributes,
	} = props;
	const formatOptions = [
		{
			key: 'MMDDYYYY',
			name: 'MMDDYYYY',
		},
		{
			key: 'DDMMYYYY',
			name: 'DDMMYYYY',
		},
		{
			key: 'YYYYMMDD',
			name: 'YYYYMMDD',
		},
	];
	const separatorOptions = [
		{
			key: '/',
			name: '/',
		},
		{
			key: '-',
			name: '-',
		},
		{
			key: '.',
			name: '.',
		},
	];
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Date Format" />

				<SelectControl
					className={ css`
						margin-top: 5px;
					` }
					onChange={ ( { selectedItem } ) =>
						setAttributes( { format: selectedItem.key } )
					}
					options={ formatOptions }
					value={ formatOptions.find(
						( option ) => option.key === format
					) }
				/>
				<SelectControl
					className={ css`
						margin-top: 10px;
					` }
					value={ separatorOptions.find(
						( option ) => option.key === separator
					) }
					onChange={ ( { selectedItem } ) =>
						setAttributes( { separator: selectedItem.key } )
					}
					options={ separatorOptions }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default DateControls;

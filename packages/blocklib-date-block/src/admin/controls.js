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
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DateControls = ( props ) => {
	const {
		id,
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
	const {
		setFieldAnswer,
		setIsFieldAnswered,
		setIsFieldValid,
		setFieldValidationErrr,
	} = useDispatch( 'quillForms/renderer-core' );
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Date Format" />

				<SelectControl
					className={ css`
						margin-top: 5px;
					` }
					onChange={ ( { selectedItem } ) => {
						// Formatting changes can cause errors if the field has value already.
						// The problem comes when trying to assign invalid values to month or year or day.
						// That's why we are going to reset the field value.
						// The ideal solution should be reformatting the existing value to the new format not just resetting.
						setFieldAnswer( id, '' );
						setIsFieldValid( id, true );
						setIsFieldAnswered( id, false );
						setFieldValidationErrr( id, null );
						setAttributes( { format: selectedItem.key } );
					} }
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

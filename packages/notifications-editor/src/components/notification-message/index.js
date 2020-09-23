/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlLabel,
	__experimentalControlWrapper,
	RichTextControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import AlertMessageWrapper from '../alert-message-wrapper';

const EmailMessage = ( {
	isReviewing,
	isValid,
	setIsValid,
	value,
	setValue,
} ) => {
	useEffect( () => {
		if ( value && value.length > 0 ) {
			setIsValid( true );
		} else {
			setIsValid( false );
		}
	}, [ value ] );
	const { fields } = useSelect( ( select ) => {
		return {
			fields: select( 'quillForms/block-editor' )
				.getEditableFields()
				.map( ( field ) => {
					return {
						varType: 'field',
						ref: field.id,
						title: field.title,
					};
				} ),
		};
	} );
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel
					label="Message"
					showAsterisk={ true }
				/>
				<RichTextControl
					variables={ [
						{
							varType: 'form',
							ref: 'all_answers',
							title: 'all_answers',
						},
					].concat( fields ) }
					value={ value }
					setValue={ ( newVal ) => {
						setValue( newVal );
					} }
				/>
			</__experimentalControlWrapper>
			{ ! isValid && isReviewing && (
				<AlertMessageWrapper type="error">
					This field is required!
				</AlertMessageWrapper>
			) }
		</__experimentalBaseControl>
	);
};
export default EmailMessage;

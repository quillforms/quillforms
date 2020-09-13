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

const EmailMessage = ( { value, setValue } ) => {
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
				<__experimentalControlLabel label="Message" />
				<RichTextControl
					variables={ [
						{
							varType: 'form',
							ref: 'all_answers',
							title: 'all_answers',
						},
					].concat( fields ) }
					value={ value }
					setValue={ ( newVal ) => setValue( newVal ) }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default EmailMessage;

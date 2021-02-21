/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlLabel,
	__experimentalControlWrapper,
} from '@quillforms/admin-components';
import { getPlainExcerpt, RichTextControl } from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';
/**
 * Internal Dependencies
 */
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
		const blockTypes = select( 'quillForms/blocks' ).getBlockTypes();
		return {
			fields: select( 'quillForms/block-editor' )
				.getEditableFields()
				.map( ( field ) => {
					return {
						type: 'field',
						modifier: field.id,
						label: getPlainExcerpt( field.attributes.label ),
						icon: blockTypes[ field.name ]?.icon,
						color: blockTypes[ field.name ]?.color,
						order: select(
							'quillForms/block-editor'
						).getBlockOrderById( field.id ),
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
					className={ css`
						min-height: 120px !important;
					` }
					mergeTags={ [
						{
							type: 'form',
							modifier: 'all_answers',
							label: 'all_answers',
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

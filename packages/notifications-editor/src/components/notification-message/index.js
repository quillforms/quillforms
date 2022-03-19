/**
 * QuillForms Dependencies
 */
import {
	BaseControl,
	ControlLabel,
	ControlWrapper,
	getPlainExcerpt,
	RichTextControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

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

	let mergeTags = [
		{
			type: 'form',
			modifier: 'all_answers',
			label: 'all_answers',
		},
	].concat( fields );
	mergeTags = mergeTags.concat(
		applyFilters( 'QuillForms.Builder.MergeTags', [] )
	);

	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Message" showAsterisk={ true } />
				<RichTextControl
					className={ css`
						min-height: 120px !important;
					` }
					mergeTags={ mergeTags }
					value={ value }
					setValue={ ( newVal ) => {
						setValue( newVal );
					} }
					allowedFormats={ [ 'bold', 'italic', 'link' ] }
				/>
			</ControlWrapper>
			{ ! isValid && isReviewing && (
				<AlertMessageWrapper type="error">
					This field is required!
				</AlertMessageWrapper>
			) }
		</BaseControl>
	);
};
export default EmailMessage;

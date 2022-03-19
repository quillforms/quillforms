/**
 * QuillForms Dependencies
 */
import {
	ControlLabel,
	ControlWrapper,
	BlockIconBox,
	SelectControl,
	getPlainExcerpt,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import AlertMessageWrapper from '../alert-message-wrapper';

const EmailSelect = ( { isRequired, value, setValue, emailFields, label } ) => {
	if ( ! value || ! value.match( /{{field:([a-zA-Z0-9-_]+)}}/g ) ) {
		value = '';
	}
	value = value.replace( '{{field:', '' );
	value = value.replace( '}}', '' );
	const { emailBlockType } = useSelect( ( select ) => {
		return {
			emailBlockType: select( 'quillForms/blocks' ).getBlockType(
				'email'
			),
		};
	} );
	useEffect( () => {
		if ( ! emailFields || emailFields.length === 0 ) {
			setValue( '' );
			return;
		}
		const index = emailFields.findIndex( ( field ) => field.id === value );
		if ( index === -1 ) {
			setValue( emailFields[ 0 ].id );
		}
	}, [ JSON.stringify( emailFields ) ] );

	const emailFieldsOptions = emailFields?.map( ( field ) => {
		return {
			key: field.id,
			name: (
				<div className="notifications-editor-email-select__option">
					<BlockIconBox
						icon={ emailBlockType?.icon }
						color={ emailBlockType?.color }
					/>
					<span className="notifications-editor-email-select__option-title">
						{ getPlainExcerpt( field.attributes.label ) }
					</span>
				</div>
			),
		};
	} );

	return (
		<ControlWrapper orientation="vertical">
			{ !! label && <ControlLabel label={ label } /> }
			{ emailFields.length === 0 ? (
				<AlertMessageWrapper type={ isRequired ? 'error' : '' }>
					To select an email, you should have at least one email
					question
				</AlertMessageWrapper>
			) : (
				<SelectControl
					className="notifications-editor-email-select"
					placeholder="Choose Email"
					value={ emailFieldsOptions.find(
						( option ) => option.key === value
					) }
					onChange={ ( { selectedItem } ) =>
						setValue( selectedItem.key )
					}
					options={ emailFieldsOptions }
				/>
			) }
		</ControlWrapper>
	);
};
export default EmailSelect;

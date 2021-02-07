/**
 * QuillForms Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';
import {
	__experimentalControlLabel,
	__experimentalControlWrapper,
	BlockIconBox,
	SelectControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import AlertMessageWrapper from '../alert-message-wrapper';

const EmailSelect = ( { isRequired, value, setValue, emailFields, label } ) => {
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
			name: getPlainExcerpt( field.title ),
		};
	} );
	return (
		<__experimentalControlWrapper orientation="vertical">
			{ !! label && <__experimentalControlLabel label={ label } /> }
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
		</__experimentalControlWrapper>
	);
};
export default EmailSelect;

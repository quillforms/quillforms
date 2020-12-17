/**
 * QuillForms Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';
import {
	__experimentalControlLabel,
	__experimentalControlWrapper,
	BlockIconBox,
	SelectControl,
	MenuItem,
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
					value={ value }
					onChange={ ( e ) => setValue( e.target.value ) }
				>
					{ emailFields.map( ( emailField ) => (
						<MenuItem key={ emailField.id } value={ emailField.id }>
							<div className="notifications-editor-email-select__option">
								<BlockIconBox blockType="email" />
								<span className="notifications-editor-email-select__option-title">
									{ getPlainExcerpt( emailField.title ) }
								</span>
							</div>
						</MenuItem>
					) ) }
				</SelectControl>
			) }
		</__experimentalControlWrapper>
	);
};
export default EmailSelect;

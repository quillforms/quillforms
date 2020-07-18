/**
 * QuillForms Dependencies
 */
import { getPlainExcerpt } from '@quillforms/rich-text';
import {
	__experimentalBaseControl,
	__experimentalControlLabel,
	__experimentalControlWrapper,
	BlockIconBox,
} from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const ReplyTo = ( { value, setValue, emailFields } ) => {
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
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Reply to" />
				{ emailFields.length === 0 ? (
					<span className="notifications-editor-replyTo__no-emails-msg">
						To send someone an email after completing the form, you
						should have at least one email question
					</span>
				) : (
					<Select
						className="notifications-editor-replyTo__email-select"
						placeholder="Choose Email"
						value={ value }
						onChange={ ( e ) => setValue( e.target.value ) }
					>
						{ emailFields.map( ( emailField ) => (
							<MenuItem
								key={ emailField.id }
								value={ emailField.id }
							>
								<div className="notifications-editor-replyTo__email-select-option">
									<BlockIconBox blockType="email" />
									<span className="notifications-editor-replyTo__email-select-option-title">
										{ getPlainExcerpt( emailField.title ) }
									</span>
								</div>
							</MenuItem>
						) ) }
					</Select>
				) }
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};
export default ReplyTo;

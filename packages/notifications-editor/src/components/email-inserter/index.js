/**
 * QuillForms Dependencies
 */
import { Button, TextControl } from '@quillforms/builder-components';
/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';

const EmailInserter = ( { addEmail } ) => {
	const [ value, setValue ] = useState( '' );
	const [ err, setErr ] = useState( false );
	const validateEmail = ( email ) => {
		const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test( String( email ).toLowerCase() );
	};

	return (
		<div className="notifications-editor-email-inserter">
			<div className="notifications-editor-email-inserter__email-input-wrapper">
				<div className="notifications-editor-email-inserter__email-input">
					<TextControl
						type="email"
						value={ value }
						setValue={ ( newVal ) => {
							setErr( false );
							setValue( newVal );
						} }
					/>
				</div>
				<Button
					className="notifications-editor-email-inserter__email-add-btn"
					isSmall
					isPrimary
					onClick={ () => {
						if ( validateEmail( value ) ) {
							setErr( false );
							addEmail( value );
							setValue( '' );
						} else {
							setErr( true );
						}
					} }
				>
					Add
				</Button>
			</div>
			<span
				className="notifications-editor-email-inserter__instructions"
				style={ { color: err ? 'red' : '#867f7f' } }
			>
				{ err
					? 'Please insert a correct email'
					: 'Type an email here then click add' }
			</span>
		</div>
	);
};
export default EmailInserter;

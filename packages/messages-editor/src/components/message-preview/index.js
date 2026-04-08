import { Fragment } from 'react';
import ResetIcon from '../icons/reset';

const MessagePreview = ( { value, showReset, onReset, onChange } ) => {
	return (
		<Fragment>
			<div className="messages-editor-message-preview__container">
				<input
					type="text"
					value={ value ?? '' }
					onChange={ ( e ) => onChange?.( e.target.value ) }
					className="messages-editor-message-preview"
				/>
				{ showReset && (
					<button
						type="button"
						className="messages-editor-message-preview__reset"
						onClick={ onReset }
						aria-label="Restore default message"
						title="Restore default message"
					>
						<ResetIcon/>
					</button>
				) }
			</div>
		</Fragment>
	);
};
export default MessagePreview;

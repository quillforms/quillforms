/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import MessagePreview from '../message-preview';
import MessageBaseControl from '../base-control';
import MessageControlWrapper from '../control-wrapper';
import MessageControlLabel from '../control-label';
import MessageEdit from '../message-edit';

const MessageRow = ( {
	index,
	messageToEdit,
	setMessageToEdit,
	defaultValue,
	messageKey,
	value,
	format,
	label,
	mergeTags,
	allowedFormats,
} ) => {
	const [ isMounted, setIsMounted ] = useState( false );

	useEffect( () => {
		setTimeout( () => {
			setIsMounted( true );
		}, 50 );
	}, [] );
	const isSelected = messageToEdit === messageKey;
	return (
		<div
			className={ classnames(
				'message-editor-message-row',
				css`
					opacity: 0;
					transform: scale( 0.6 );
					transition: all 0.3s ease;
					transition-delay: ${ index * 0.05 }s;

					&.mounted {
						opacity: 1;
						transform: scale( 1 );
					}
				`,
				{
					mounted: isMounted,
				}
			) }
			role="presentation"
			onClick={ () => setMessageToEdit( messageKey ) }
		>
			<MessageBaseControl>
				<MessageControlWrapper
					orientation={ isSelected ? 'vertical' : 'horizontal' }
				>
					<MessageControlLabel label={ label } />
					{ ! isSelected ? (
						<MessagePreview format={ format } value={ value } />
					) : (
						<MessageEdit
							format={ format }
							messageKey={ messageKey }
							value={ value }
							editingComplete={ () => {
								setMessageToEdit( null );
							} }
							mergeTags={ mergeTags }
							defaultValue={ defaultValue }
							allowedFormats={ allowedFormats }
						/>
					) }
				</MessageControlWrapper>
			</MessageBaseControl>
		</div>
	);
};

export default MessageRow;

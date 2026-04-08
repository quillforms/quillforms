/**
 * WordPress Dependencies
 */
import { useState, useEffect } from 'react';
import { useDispatch } from '@wordpress/data';

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

const MessageRow = ({
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
}) => {
	const [isMounted, setIsMounted] = useState(false);
	const { setMessage } = useDispatch( 'quillForms/messages-editor' );

	useEffect(() => {
		setTimeout(() => {
			setIsMounted(true);
		}, 50);
	}, []);
	const isChanged = ( value ?? '' ) !== ( defaultValue ?? '' );
	return (
		<div
			className={classnames(
				'message-editor-message-row',
				css`
					opacity: 0;
					transform: scale( 0.6 );
					transition: all 0.3s ease;
					transition-delay: ${index * 0.05}s;

					&.mounted {
						opacity: 1;
						transform: scale( 1 );
						transition-delay: 0s;
						
					}
				`,
				{
					mounted: isMounted,
				}
			)}
			role="presentation"
		>
			<MessageBaseControl>
				<MessageControlWrapper orientation="horizontal">
					<MessageControlLabel label={label} />
					<MessagePreview
						format={format}
						value={value}
						showReset={isChanged}
						onChange={(newValue) => {
							setMessage(messageKey, newValue);
						}}
						onReset={(e) => {
							e.stopPropagation();
							setMessage(messageKey, defaultValue);
						}}
					/>
				</MessageControlWrapper>
			</MessageBaseControl>
		</div>
	);
};

export default MessageRow;

/**
 * QuillForms Dependencies
 */
import {
	__unstableTransforms as Transforms,
	__unstableReactEditor as ReactEditor,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */

import { Tooltip, Icon, Modal } from '@wordpress/components';
import { createPortal, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
/**
 * Internal Dependencies
 */
import BlockActions from '../block-actions';
import BlockControls from '../block-controls';
import ControlsIcon from './controls-icon';

// import { EmojiPicker } from '@quillforms/admin-components';

const BlockToolbar = ( { id, index, editor, parentId, parentIndex } ) => {
	const [ showBlockControls, setShowBlockControls ] = useState( false );
	// // Insert Emoji
	// const insertEmoji = ( emoji ) => {
	// 	insertText( editor, emoji.native );
	// };
	return (
		<div className="block-editor-block-toolbar">
			<Tooltip text="Controls" position="bottom center">
				<div
					role="presentation"
					className="block-editor-block-toolbar__controls-icon-wrapper"
					onClick={ () => {
						setShowBlockControls( true );
					} }
				>
					<Icon
						className="block-editor-block-toolbar__controls-icon"
						icon={ ControlsIcon }
					/>
				</div>
			</Tooltip>
			<Tooltip text="Recall Information" position="bottom center">
				<div className="block-editor-block-toolbar__merge-tag-icon-wrapper">
					<div
						role="presentation"
						className="block-editor-block-toolbar__merge-tag-icon"
						onClick={ () => {
							Transforms.insertText( editor, '@' );
							ReactEditor.focus( editor );
						} }
					>
						@
					</div>
				</div>
			</Tooltip>

			{ /* <EmojiPicker emojiSelect={ ( emoji ) => insertEmoji( emoji ) } /> */ }

			<BlockActions
				id={ id }
				index={ index }
				parentIndex={ parentIndex }
				parentId={ parentId }
			/>
			{ showBlockControls && (
				<Modal
					overlayClassName={ 'qf-custom-modal' }
					className={ css`
						border: none !important;
						min-width: 350px !important;
						min-height: calc( 100% - 54px ) !important;
						margin-bottom: 0 !important;

						.components-modal__content {
							margin-top: 54px;
							background: #eee !important;
						}

						.components-modal__header {
							background: #a120f1;
							.components-modal__header-heading {
								color: #fff;
							}
							.components-button.has-icon svg {
								fill: #fff;
							}
						}
					` }
					// Because focus on editor is causing the click handler to be triggered
					title="Block Controls"
					shouldCloseOnClickOutside={ false }
					onRequestClose={ () => {
						setShowBlockControls( false );
					} }
				>
					<BlockControls parentIndex={ parentIndex } />
				</Modal>
			) }
		</div>
	);
};

export default BlockToolbar;

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
import { Tooltip } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { Icon } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import BlockActions from '../block-actions';
import ControlsIcon from './controls-icon';

// import { EmojiPicker } from '@quillforms/admin-components';

const BlockToolbar = ( { id, editor } ) => {
	const { setCurrentPanel } = useDispatch( 'quillForms/builder-panels' );
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
						setCurrentPanel( 'blockControls' );
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

			<BlockActions id={ id } />
		</div>
	);
};

export default BlockToolbar;

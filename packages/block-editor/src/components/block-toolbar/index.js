/**
 * QuillForms Dependencies
 */
import { Tooltip } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import BuildIcon from '@material-ui/icons/Build';

/**
 * Internal Dependencies
 */
import BlockActions from '../block-actions';
import PrevFieldInserter from '../prevfields-inserter';

// import { EmojiPicker } from '@quillforms/builder-components';

const BlockToolbar = ( { id, category, insertVariable } ) => {
	const { setCurrentPanel } = useDispatch( 'quillForms/builder-panels' );

	return (
		<div className="block-editor-block-toolbar">
			<Tooltip title="Controls" placement="bottom" arrow={ true }>
				<div
					role="presentation"
					className="block-editor-block-toolbar__controls-icon"
					onClick={ () => {
						setCurrentPanel( 'blockControls' );
					} }
				>
					<BuildIcon />
				</div>
			</Tooltip>
			{
				<PrevFieldInserter
					category={ category }
					id={ id }
					onInsert={ ( variable ) => insertVariable( variable ) }
				/>
			}

			{ /* <EmojiPicker emojiSelect={ ( emoji ) => insertEmoji( emoji ) } /> */ }

			<BlockActions id={ id } category={ category } />
		</div>
	);
};

export default BlockToolbar;

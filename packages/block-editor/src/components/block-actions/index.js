/**
 * QuillForms Dependencies
 */
import { Tooltip } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
/**
 * External Dependencies
 */
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const BlockActions = ( { id } ) => {
	const { deleteFormBlock } = useDispatch( 'quillForms/block-editor' );
	const [ anchorEl, setAnchorEl ] = useState( null );
	const openDropDownMenu = ( event ) => {
		setAnchorEl( event.currentTarget );
	};
	const handleClose = () => {
		setAnchorEl( null );
	};

	// Delete Block
	const handleDelete = ( e ) => {
		e.stopPropagation();

		if (
			confirm(
				'Are you sure you want to delete this item? All of its data will be deleted after saving'
			)
		) {
			deleteFormBlock( id );
		}
	};

	return (
		<div className="block-editor-block-actions">
			<Tooltip title="More options" placement="bottom" arrow={ true }>
				<div
					role="presentation"
					className="block-editor-block-actions__icon-wrapper"
					aria-controls="block-editor-block-actions__menu"
					aria-haspopup="true"
					onClick={ openDropDownMenu }
				>
					<MoreVertIcon />
				</div>
			</Tooltip>
			{ anchorEl && (
				<Menu
					id={ `block-editor-block-actions__menu` }
					anchorEl={ anchorEl }
					keepMounted
					open={ Boolean( anchorEl ) }
					onClose={ handleClose }
				>
					<MenuItem onClick={ ( e ) => handleDelete( e ) }>
						<DeleteIcon /> Delete
					</MenuItem>
				</Menu>
			) }
		</div>
	);
};
export default BlockActions;

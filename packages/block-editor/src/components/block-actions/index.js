/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem, Icon } from '@wordpress/components';
import { moreHorizontal, trash } from '@wordpress/icons';

const BlockActions = ( { id } ) => {
	const { deleteBlock } = useDispatch( 'quillForms/block-editor' );

	// Delete Block
	const handleDelete = ( e ) => {
		e.stopPropagation();

		if (
			confirm(
				'Are you sure you want to delete this item? All of its data will be deleted after saving'
			)
		) {
			deleteBlock( id );
		}
	};

	return (
		<>
			<DropdownMenu
				icon={ moreHorizontal }
				position="bottom left"
				className="block-editor-block-actions__dropdown"
			>
				{ ( { onClose } ) => (
					<MenuGroup className="block-editor-block-actions__menu-group">
						<MenuItem onClick={ ( e ) => handleDelete( e ) }>
							<Icon icon={ trash } /> Delete
						</MenuItem>
					</MenuGroup>
				) }
			</DropdownMenu>
		</>
	);
};
export default BlockActions;

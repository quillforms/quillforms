/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { doAction, applyFilters } from '@wordpress/hooks';
import { DropdownMenu, MenuGroup, MenuItem, Icon } from '@wordpress/components';
import { trash } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { confirmAlert } from 'react-confirm-alert';

/**
 * Internal Dependencies
 */
import DeleteAlert from '../delete-alert';

interface Props {
	id: string;
}
const BlockActions: React.FC< Props > = ( { id } ) => {
	const { deleteBlock } = useDispatch( 'quillForms/block-editor' );

	// Delete Block
	const handleDelete = ( e: React.MouseEvent ) => {
		e.stopPropagation();

		let deleteAlerts: string[] = [];
		deleteAlerts = deleteAlerts.concat(
			applyFilters(
				'QuillForms.BlockEditor.BlockDeleteAlerts',
				[],
				id
			) as string[]
		);
		confirmAlert( {
			customUI: ( { onClose } ) => {
				return (
					<DeleteAlert
						messages={ deleteAlerts }
						approve={ () => {
							doAction(
								'QuillForms.BlockEditor.BlockDelete',
								id
							);
							deleteBlock( id );
							onClose();
						} }
						reject={ () => {
							onClose();
						} }
						closeModal={ onClose }
					/>
				);
			},
		} );
	};

	return (
		<DropdownMenu
			label=""
			icon={ 'ellipsis' }
			// @ts-expect-error
			popoverProps={ {
				position: 'bottom left',
			} }
			className="block-editor-block-actions__dropdown"
		>
			{ ( { onClose } ) => (
				<MenuGroup className="block-editor-block-actions__menu-group">
					<MenuItem
						onClick={ (
							e: React.MouseEvent< HTMLButtonElement >
						) => {
							onClose();
							handleDelete( e );
						} }
					>
						<Icon icon={ trash } /> Delete
					</MenuItem>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
};
export default BlockActions;

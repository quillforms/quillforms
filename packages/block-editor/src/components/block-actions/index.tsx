/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { DropdownMenu, MenuGroup, MenuItem, Icon } from '@wordpress/components';
import { trash } from '@wordpress/icons';
import React from 'react';

interface Props {
	id: string;
}
const BlockActions: React.FC< Props > = ( { id } ) => {
	const { deleteBlock } = useDispatch( 'quillForms/block-editor' );

	// Delete Block
	const handleDelete = ( e: React.MouseEvent ) => {
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
		<DropdownMenu
			label=""
			icon={ 'ellipsis' }
			// @ts-expect-error
			popoverProps={ {
				position: 'bottom left',
			} }
			className="block-editor-block-actions__dropdown"
		>
			{ () => (
				<MenuGroup className="block-editor-block-actions__menu-group">
					<MenuItem
						onClick={ (
							e: React.MouseEvent< HTMLButtonElement >
						) => handleDelete( e ) }
					>
						<Icon icon={ trash } /> Delete
					</MenuItem>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
};
export default BlockActions;

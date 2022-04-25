/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { doAction, applyFilters } from '@wordpress/hooks';
import { DropdownMenu, MenuGroup, MenuItem, Icon } from '@wordpress/components';
import { trash } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { confirmAlert } from 'react-confirm-alert';
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import DeleteAlert from '../delete-alert';
import DuplicateIcon from '../duplicate-icon';

interface Props {
	id: string;
}
const BlockActions: React.FC< Props > = ( { id } ) => {
	const { deleteBlock, __experimentalInsertBlock } = useDispatch(
		'quillForms/block-editor'
	);

	const { block, currentBlockIndex } = useSelect( ( select ) => {
		return {
			block: select( 'quillForms/block-editor' ).getBlockById( id ),
			currentBlockIndex: select(
				'quillForms/block-editor'
			).getCurrentBlockIndex(),
		};
	} );

	if ( ! block ) {
		return null;
	}
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
			popoverProps={ {
				position: 'bottom left',
			} }
			className={ classnames(
				'block-editor-block-actions__dropdown',
				css`
					.components-menu-item__item {
						min-width: auto;
						svg {
							margin: 0 5px;
						}
					}
				`
			) }
		>
			{ ( { onClose } ) => (
				<MenuGroup className="block-editor-block-actions__menu-group">
					{ block.name !== 'welcome-screen' && (
						<MenuItem
							onClick={ (
								e: React.MouseEvent< HTMLButtonElement >
							) => {
								onClose();
								__experimentalInsertBlock(
									{
										...block,
										id: Math.random()
											.toString( 36 )
											.substr( 2, 9 ),
									},
									{ index: currentBlockIndex + 1 }
								);
							} }
						>
							<DuplicateIcon /> Duplicate
						</MenuItem>
					) }
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

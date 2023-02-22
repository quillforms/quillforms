/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { doAction, applyFilters } from '@wordpress/hooks';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';

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
import { map, size } from 'lodash';

interface Props {
	id: string;
	index: number;
	parentIndex?: number;
	parentId?: string;
}
const BlockActions: React.FC< Props > = ( {
	id,
	index,
	parentId,
	parentIndex,
} ) => {
	const { deleteBlock, __experimentalInsertBlock } = useDispatch(
		'quillForms/block-editor'
	);

	const { block } = useSelect( ( select ) => {
		return {
			block: select( 'quillForms/block-editor' ).getBlockById(
				id,
				parentIndex
			),
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
							deleteBlock( id, parentId );
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
			className={ classnames(
				'block-editor-block-actions__dropdown',
				css`
					.components-menu-item__item {
						min-width: auto;
					}
				`
			) }
		>
			{ ( { onClose } ) => (
				<MenuGroup className="block-editor-block-actions__menu-group">
					{ block.name !== 'welcome-screen' && (
						<MenuItem
							onClick={ () => {
								onClose();

								const newBlock = {
									...block,
									id: Math.random()
										.toString( 36 )
										.substr( 2, 9 ),
								};

								if ( size( newBlock?.innerBlocks ) > 0 ) {
									newBlock.innerBlocks = map(
										newBlock.innerBlocks,
										( childBlock ) => {
											return {
												...childBlock,
												id: Math.random()
													.toString( 36 )
													.substr( 2, 9 ),
											};
										}
									);
								}

								__experimentalInsertBlock(
									{ ...newBlock },
									index + 1,
									parentId
								);
							} }
						>
							Duplicate
						</MenuItem>
					) }
					<MenuItem
						onClick={ (
							e: React.MouseEvent< HTMLButtonElement >
						) => {
							onClose();
							handleDelete( e );
						} }
						className={ css`
							.components-menu-item__item {
								color: #b71717 !important;
							}
						` }
					>
						Delete
					</MenuItem>
				</MenuGroup>
			) }
		</DropdownMenu>
	);
};
export default BlockActions;

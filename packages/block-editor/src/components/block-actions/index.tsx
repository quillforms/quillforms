/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { doAction, applyFilters } from '@wordpress/hooks';
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

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

const BLOCK_ACTIONS_MENU_ICON = (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
		<path
			d="M3.0166 11.7024C3.10391 11.3889 3.1959 11.0789 3.39512 10.8106C3.88262 10.1549 4.69414 9.84904 5.46875 10.0389C6.2791 10.2375 6.85801 10.8674 6.98457 11.6871C7.14629 12.7395 6.42793 13.7637 5.40137 13.9436C4.28633 14.1393 3.25742 13.4455 3.05176 12.3586C3.04531 12.3258 3.02891 12.2947 3.01719 12.2631C3.01719 12.0762 3.01719 11.8887 3.01719 11.7018L3.0166 11.7024Z"
			fill="#B2328C"
		/>
		<path
			d="M10.001 11.9788C10.0021 10.879 10.898 9.98544 11.999 9.98544C13.107 9.98544 14.0012 10.8854 13.9971 11.9964C13.993 13.0938 13.093 13.9839 11.9902 13.9809C10.8916 13.978 9.99981 13.0804 10.001 11.9788Z"
			fill="#B2328C"
		/>
		<path
			d="M20.981 11.9888C20.9798 13.0897 20.0862 13.9815 18.9835 13.981C17.8849 13.981 16.986 13.0833 16.9849 11.9858C16.9837 10.8808 17.8872 9.98193 18.9952 9.98486C20.0944 9.98838 20.9821 10.8837 20.9804 11.9888L20.981 11.9888Z"
			fill="#B2328C"
		/>
	</svg>
);

interface Props {
	id: string;
	parentIndex?: number;
	parentId?: string;
	disableDelete?: boolean;
	onAction: () => void;
}
const BlockActions: React.FC<Props> = ({
	id,
	parentId,
	onAction,
	disableDelete

}) => {
	const { deleteBlock, __experimentalInsertBlock } = useDispatch(
		'quillForms/block-editor'
	);

	// Tree passes `parentId === "root"` for top-level rows; the block store expects `undefined` for root.
	const effectiveParentId =
		!parentId || parentId === 'root' ? undefined : parentId;

	const { blocks, allBlocks } = useSelect((select) => {
		const store = select('quillForms/block-editor');
		return {
			blocks: store.getBlocks(true),
			allBlocks: store.getAllBlocks(),
		};
	});

	let parentIndex: number | undefined;

	if (!effectiveParentId) {
		parentIndex = undefined;
	} else {
		parentIndex = blocks.findIndex((block) => block.id === effectiveParentId);
	}

	let index;

	if (
		!effectiveParentId ||
		parentIndex === undefined ||
		parentIndex < 0
	) {
		index = blocks.findIndex((block) => block.id === id);
		if (index < 0) {
			index = allBlocks.findIndex((block) => block.id === id);
		}
	} else {
		index =
			blocks[parentIndex]?.innerBlocks?.findIndex(
				(block) => block.id === id
			) ?? -1;
	}



	const { block } = useSelect((select) => {
		return {
			block: select('quillForms/block-editor').getBlockById(
				id,
				parentIndex
			),
		};
	});

	if (!block) {
		return null;
	}
	// Delete Block
	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();

		let deleteAlerts: string[] = [];
		deleteAlerts = deleteAlerts.concat(
			applyFilters(
				'QuillForms.BlockEditor.BlockDeleteAlerts',
				[],
				id
			) as string[]
		);
		confirmAlert({
			customUI: ({ onClose }) => {
				return (
					<DeleteAlert
						messages={deleteAlerts}
						approve={() => {
							doAction(
								'QuillForms.BlockEditor.BlockDelete',
								id
							);
							deleteBlock(id, effectiveParentId);
							onClose();
							handleBlockModification();
						}}
						reject={() => {
							onClose();
						}}
						closeModal={onClose}
					/>
				);
			},
		});
	};
	const handleBlockModification = () => {
		// Ensure synchronous execution of block modification and tree recalculation
		setTimeout(() => {
			onAction();
		}, 0);
	};

	return (
		<div
			className="block-editor-block-actions__dropdown-wrapper"
			onClick={(e) => e.stopPropagation()}
			// dnd-kit sortable attaches pointer listeners on the row; stop drag from stealing menu clicks.
			onPointerDown={(e) => e.stopPropagation()}
			onMouseDown={(e) => e.stopPropagation()}
			onTouchStart={(e) => e.stopPropagation()}
		>
			<DropdownMenu
				label={__('Block actions', 'quillforms')}
				icon={BLOCK_ACTIONS_MENU_ICON}
				className={classnames(
					'block-editor-block-actions__dropdown',
					css`
                        .components-menu-item__item {
                            min-width: auto;
                        }
                    `
				)}
			>
				{({ onClose }) => (
					<MenuGroup className="block-editor-block-actions__menu-group" >
						{(block.name !== 'welcome-screen' && block.name !== 'partial-submission-point') && (
							<MenuItem
								onClick={() => {
									onClose();
									const newBlock = {
										...block,
										id: Math.random().toString(36).substr(2, 9),
									};

									if (size(newBlock?.innerBlocks) > 0) {
										newBlock.innerBlocks = map(
											newBlock.innerBlocks,
											(childBlock) => ({
												...childBlock,
												id: Math.random().toString(36).substr(2, 9),
											})
										);
									}

									__experimentalInsertBlock(
										{ ...newBlock },
										index + 1,
										effectiveParentId
									);

									handleBlockModification();
								}}
							>
								{__('Duplicate', 'quillforms')}
							</MenuItem>
						)}
						{!disableDelete && (
							<MenuItem
								onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
									onClose();
									handleDelete(e);
								}}
								className={css`
                                    .components-menu-item__item {
                                        color: #b71717 !important;
                                    }
                                `}
							>
								{__('Delete', 'quillforms')}
							</MenuItem>
						)}
					</MenuGroup>
				)}
			</DropdownMenu>
		</div>
	);
};
export default BlockActions;

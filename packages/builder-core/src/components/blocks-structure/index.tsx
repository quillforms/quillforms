import React, { useState, useCallback, useEffect } from "react";
import {
	DndContext,
	DragOverlay,
	closestCenter,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
	type DragEndEvent,
	type DragStartEvent,
} from "@dnd-kit/core";
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { identAlphabetically } from "@quillforms/utils";
import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockIconBox, getPlainExcerpt, withErrorBoundary } from "@quillforms/admin-components";
import { BlockActions } from "@quillforms/block-editor";

import { doAction, applyFilters } from '@wordpress/hooks';

import { useSelect, useDispatch } from "@wordpress/data";
import DragAlert from '../drag-alert';
import { FormBlock, FormBlocks } from "@quillforms/types";
import { size } from "lodash";
import { confirmAlert } from 'react-confirm-alert';
import BlockTreeErrorBoundary from "../block-tree-error-boundary";



// Your custom block structure
type Attributes = {
	[key: string]: any;
};

type Block = {
	id: ItemId;
	name: string;
	attributes: Attributes;
	innerBlocks?: FormBlocks
};

type ItemId = string;

type TreeItem = {
	id: ItemId;
	children: ItemId[];
	hasChildren: boolean;
	isExpanded: boolean;
	data: {
		[key: string]: any;
		name: string;
		attributes?: Attributes;
		blockOrder?: string;
	};
};

type TreeData = {
	rootId: ItemId;
	items: Record<ItemId, TreeItem>;
};

type TreeSourcePosition = {
	parentId: ItemId;
	index: number;
};

type TreeDestinationPosition = {
	parentId: ItemId;
	index: number;
};

type RenderItemParams = {
	item: TreeItem;
	depth: number;
	parentId?: ItemId;
	childrenContent?: React.ReactNode;
};

const LIST_BLOCK_ICON = {
	src: (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
			<path d="M3.00047 4.87941C3.02489 4.82211 3.05073 4.76528 3.07327 4.70704C3.23907 4.28434 3.6397 4.00253 4.09106 4.00159C5.61375 3.99971 7.13597 3.99924 8.65865 4.00159C9.26313 4.00253 9.74783 4.49146 9.74877 5.09969C9.75112 6.61627 9.75112 8.13286 9.74877 9.64944C9.74783 10.2577 9.2636 10.7466 8.65865 10.748C7.13597 10.7508 5.61375 10.7504 4.09106 10.748C3.6397 10.7475 3.23766 10.4643 3.0728 10.0426C3.05026 9.98479 3.02442 9.92796 3 9.87066C3 8.2066 3 6.54254 3 4.87848L3.00047 4.87941ZM6.35771 9.99747C7.0782 9.99747 7.79868 9.99794 8.51963 9.99747C8.88081 9.99747 8.99729 9.88334 8.99729 9.52873C8.99823 8.0934 8.99823 6.65808 8.99729 5.22275C8.99729 4.87331 8.88081 4.75448 8.53748 4.75401C7.09651 4.75307 5.65508 4.75307 4.21411 4.75401C3.87031 4.75401 3.7543 4.87284 3.7543 5.22228C3.75336 6.65761 3.75336 8.09294 3.7543 9.52826C3.7543 9.88334 3.87078 9.997 4.23149 9.99747C4.94023 9.99841 5.64897 9.99747 6.35818 9.99747H6.35771Z" fill="#236294" />
			<path d="M3.00047 13.8799C3.02489 13.8226 3.05073 13.7658 3.07327 13.7075C3.23907 13.2848 3.6397 13.003 4.09106 13.0021C5.61375 13.0002 7.13597 12.9997 8.65865 13.0021C9.26313 13.003 9.74783 13.492 9.74877 14.1002C9.75112 15.6168 9.75112 17.1333 9.74877 18.6499C9.74783 19.2582 9.2636 19.7471 8.65865 19.7485C7.13597 19.7513 5.61375 19.7508 4.09106 19.7485C3.6397 19.748 3.23766 19.4648 3.0728 19.043C3.05026 18.9853 3.02442 18.9284 3 18.8711C3 17.2071 3 15.543 3 13.879L3.00047 13.8799ZM8.99729 16.3852C8.99729 15.6586 8.9987 14.9324 8.99682 14.2059C8.99588 13.8794 8.87564 13.755 8.55485 13.755C7.10215 13.7536 5.64897 13.7536 4.19627 13.755C3.87501 13.755 3.7543 13.879 3.75383 14.2049C3.75242 15.652 3.75242 17.0991 3.75383 18.5457C3.75383 18.8777 3.87595 18.997 4.21317 18.9975C5.65414 18.9984 7.09557 18.9984 8.53654 18.9975C8.87987 18.9975 8.99635 18.8777 8.99729 18.5292C8.9987 17.8144 8.99729 17.1 8.99729 16.3852Z" fill="#236294" />
			<path d="M16.3026 6.24983C14.8847 6.24983 13.4672 6.2503 12.0492 6.24983C11.7369 6.24983 11.5476 6.01029 11.65 5.74681C11.7026 5.61107 11.7994 5.52418 11.9483 5.50821C12.0239 5.50023 12.1 5.49835 12.1761 5.49835C14.9354 5.49835 17.6947 5.49835 20.4546 5.49835C20.5072 5.49835 20.5602 5.49694 20.6128 5.50023C20.8571 5.51667 21.006 5.66555 21.0003 5.88677C20.9952 6.10282 20.8331 6.24936 20.5912 6.2503C19.906 6.25171 19.2202 6.25077 18.535 6.25077C17.791 6.25077 17.0471 6.25077 16.3026 6.25077V6.24983Z" fill="#236294" />
			<path d="M16.3015 15.2501C14.8835 15.2501 13.466 15.2506 12.0481 15.2501C11.7362 15.2501 11.5474 15.0092 11.6503 14.7461C11.7034 14.6104 11.8006 14.5245 11.949 14.5085C12.0185 14.501 12.089 14.4991 12.1594 14.4991C14.9305 14.4991 17.7016 14.4991 20.4727 14.4991C20.5253 14.4991 20.5783 14.4982 20.6305 14.5029C20.8616 14.5226 21.0053 14.6738 20.9996 14.8889C20.994 15.0984 20.8343 15.2501 20.6075 15.2511C19.8456 15.2534 19.0843 15.252 18.3225 15.252C17.649 15.252 16.975 15.252 16.3015 15.252V15.2501Z" fill="#236294" />
			<path d="M14.8348 8.5011C15.7596 8.5011 16.6844 8.50016 17.6092 8.50157C17.8849 8.50157 18.0512 8.67723 18.0173 8.92851C17.9943 9.09806 17.8952 9.20374 17.7285 9.23802C17.6604 9.25211 17.589 9.25258 17.519 9.25258C15.722 9.25352 13.9251 9.25305 12.1286 9.25258C12.076 9.25258 12.0229 9.25211 11.9707 9.24601C11.7617 9.22158 11.6096 9.04968 11.6218 8.85571C11.6349 8.65422 11.7941 8.50251 12.0079 8.50204C12.6692 8.49922 13.3305 8.5011 13.9922 8.5011C14.2731 8.5011 14.554 8.5011 14.8353 8.5011H14.8348Z" fill="#236294" />
			<path d="M14.8287 17.5015C15.7479 17.5015 16.6665 17.5015 17.5857 17.5015C17.8586 17.5015 18.0206 17.6401 18.023 17.8707C18.0253 18.1008 17.8656 18.2516 17.5951 18.2521C15.7455 18.2544 13.8959 18.2544 12.0464 18.2521C11.8101 18.2521 11.6636 18.1314 11.6265 17.9322C11.5959 17.7683 11.6983 17.587 11.866 17.5283C11.9299 17.5058 12.0031 17.5025 12.0722 17.5025C12.9909 17.5011 13.91 17.5015 14.8292 17.5015H14.8287Z" fill="#236294" />
		</svg>
	),
};



// Types
type BlockCategory = 'WELCOME_SCREENS' | 'OTHERS' | 'THANKYOU_SCREENS';

// Utility functions moved to separate concerns
const blockUtils = {
	getCategory(block: FormBlock): BlockCategory {
		switch (block.name) {
			case 'welcome-screen':
				return 'WELCOME_SCREENS';
			case 'thankyou-screen':
				return 'THANKYOU_SCREENS';
			default:
				return 'OTHERS';
		}
	},

	sortBlocks(blocks: FormBlocks): FormBlocks {
		const priorityOrder: BlockCategory[] = ['WELCOME_SCREENS', 'OTHERS', 'THANKYOU_SCREENS'];
		return [...blocks].sort((a, b) => {
			const categoryA = blockUtils.getCategory(a);
			const categoryB = blockUtils.getCategory(b);
			return priorityOrder.indexOf(categoryA) - priorityOrder.indexOf(categoryB);
		});
	},

	isValidMove(
		source: TreeSourcePosition,
		destination: TreeDestinationPosition,
		tree: TreeData,
		blocks: FormBlocks
	): boolean {
		if (!destination) return false;

		const sourceItem = tree.items[tree.items[source.parentId].children[source.index]];
		const destinationParentItem = tree.items[destination.parentId];
		const sourceBlockName = sourceItem.data.name;
		const destinationParentBlockName = destinationParentItem.data.name;

		const invalidConditions = [
			// Non-root and non-group nesting
			destination.parentId !== "root" && destinationParentBlockName !== "group",


			// Welcome screen restrictions
			(destination.index === 0 &&
				destination.parentId === "root" &&
				blocks[0].name === "welcome-screen"),

			(source.index === 0 &&
				source.parentId === "root" &&
				blocks[0].name === "welcome-screen"),

			// Group blocks must be at root level
			sourceBlockName === "group" && destination.parentId !== "root",
			sourceBlockName === "partial-submission-point" && destination.parentId !== "root",

			// prevent quill-booking, calendly and cal blocks from being moved to group
			sourceBlockName === "quill-booking" && destination.parentId !== "root",
			sourceBlockName === "calendly" && destination.parentId !== "root",
			sourceBlockName === "cal" && destination.parentId !== "root",

			// Thank you screen cannot be in group
			sourceBlockName === 'thankyou-screen' && destination.parentId !== 'root'
		];

		return !invalidConditions.some(condition => condition === true);
	}
};

const treeUtils = {
	processBlocks(
		blocks: FormBlocks,
		blockTypes,
		items: Record<ItemId, TreeItem>,
		parentId: ItemId = "root",
		parentOrder = "",
		counters = {
			editable: { count: 0 },
			blockCounts: {} as Record<string, number>
		},
		prevItems?: Record<ItemId, TreeItem>
	): void {
		blocks.forEach((block, index) => {
			const blockType = blockTypes[block.name];
			const isEditable = blockType?.supports?.editable;

			if (parentId === "root" && !counters.blockCounts[block.name]) {
				counters.blockCounts[block.name] = 0;
			}

			const blockOrder = (() => {
				if (block.name === 'partial-submission-point') return '';
				if (parentId === "root") {
					if (block.name === "welcome-screen") {
						return "A";
					}

					if (isEditable || blockType?.supports?.innerBlocks) {
						counters.editable.count++;
						return counters.editable.count.toString();
					}

					counters.blockCounts[block.name]++;
					return identAlphabetically(counters.blockCounts[block.name] - 1);
				}

				return `${parentOrder}${identAlphabetically(index)}`;
			})();

			items[block.id] = {
				id: block.id,
				children: block.name !== 'group' ? [] : block.innerBlocks?.map(b => b.id) || [],
				hasChildren: block.name !== 'group' ? false : !!block.innerBlocks?.length,
				isExpanded: prevItems?.[block.id]?.isExpanded ?? true,
				data: {
					name: block.name,
					attributes: block.attributes,
					blockOrder,
					// Preserve original innerBlocks for address blocks
					...(block.name === 'address' && block.innerBlocks && {
						originalInnerBlocks: block.innerBlocks
					})
				},
			};

			if ((block.name === 'group' || block.name === 'address') && block.innerBlocks?.length) {
				treeUtils.processBlocks(
					block.innerBlocks,
					blockTypes,
					items,
					block.id,
					blockOrder,
					counters,
					prevItems
				);
			}
		});
	},

	transformBlocksToTree(blocks: FormBlocks, blockTypes, prevTree?: TreeData): TreeData {
		const items: Record<ItemId, TreeItem> = {
			root: {
				id: "root",
				children: blocks.map(block => block.id),
				hasChildren: true,
				isExpanded: true,
				data: { title: "Root", name: "root" },
			},
		};

		treeUtils.processBlocks(blocks, blockTypes, items, "root", "", {
			editable: { count: 0 },
			blockCounts: {}
		}, prevTree?.items);

		return { rootId: "root", items };
	},

	rebuildBlocks(tree: TreeData, parentId: ItemId = "root", parentOrder = ""): Block[] {
		const item = tree.items[parentId];
		return item.children.map((childId, index) => {
			const child = tree.items[childId];
			const blockOrder = parentOrder
				? `${parentOrder}${identAlphabetically(index)}`
				: (index + 1).toString();

			return {
				id: child.id,
				...child.data,
				blockOrder,
				innerBlocks: child.hasChildren
					? treeUtils.rebuildBlocks(tree, child.id, blockOrder)
					: child.data.originalInnerBlocks || undefined, // Use original inner blocks for address
			} as Block;
		});
	},

	recalculateBlockOrder(
		tree: TreeData,
		blockTypes,
		parentId: ItemId = "root",
		counters = {
			editable: { count: 0 },
			blockCounts: {} as Record<string, number>
		}
	): void {
		const item = tree.items[parentId];

		item.children.forEach((childId) => {
			const child = tree.items[childId];
			const blockType = blockTypes[child.data.name];
			const isEditable = blockType?.supports?.editable;

			// Initialize counter for root level blocks
			if (parentId === "root" && !counters.blockCounts[child.data.name]) {
				counters.blockCounts[child.data.name] = 0;
			}

			// Calculate block order
			let blockOrder = '';
			if (parentId === "root") {
				if (child.data.name === "welcome-screen") {
					blockOrder = "A";
				} else if (child.data.name === "partial-submission-point") {
					blockOrder = "";
				} else if (isEditable || blockType?.supports?.innerBlocks) {
					counters.editable.count++;
					blockOrder = counters.editable.count.toString();
				} else {
					counters.blockCounts[child.data.name]++;
					blockOrder = identAlphabetically(counters.blockCounts[child.data.name] - 1);
				}
			} else {
				// For nested blocks, use parent's order + alphabetical index
				const parentOrder = tree.items[parentId].data.blockOrder;
				const indexInParent = item.children.indexOf(childId);
				blockOrder = `${parentOrder}${identAlphabetically(indexInParent)}`;
			}

			// Update the block order, preserving originalInnerBlocks
			child.data = {
				...child.data,
				blockOrder
			};

			// Recursively process children
			if (child.hasChildren) {
				treeUtils.recalculateBlockOrder(tree, blockTypes, childId, counters);
			}
		});
	},

	sortTreeItems(tree: TreeData, blockTypes): TreeData {
		const rootItem = tree.items.root;
		const priorityOrder = {
			'welcome-screen': 0,
			'thankyou-screen': 2,
			default: 1
		};

		// Sort children at root level only
		const sortedChildren = [...rootItem.children].sort((aId, bId) => {
			const blockA = tree.items[aId];
			const blockB = tree.items[bId];

			const priorityA = priorityOrder[blockA.data.name] ?? priorityOrder.default;
			const priorityB = priorityOrder[blockB.data.name] ?? priorityOrder.default;

			return priorityA - priorityB;
		});

		// Create new tree with sorted children
		const newTree = {
			...tree,
			items: {
				...tree.items,
				root: {
					...rootItem,
					children: sortedChildren
				}
			}
		};

		// Reset and recalculate all block orders
		treeUtils.recalculateBlockOrder(newTree, blockTypes);

		return newTree;
	}
};

const isContainerId = (id: string) => id.startsWith("container-");
const getContainerId = (parentId: ItemId) => `container-${parentId}`;
const parseContainerId = (containerId: string) => containerId.replace("container-", "");

const findParentId = (tree: TreeData, childId: ItemId): ItemId | undefined =>
	Object.keys(tree.items).find((key) => tree.items[key].children.includes(childId));

const moveItemOnTree = (
	tree: TreeData,
	source: TreeSourcePosition,
	destination: TreeDestinationPosition
): TreeData => {
	const sourceParent = tree.items[source.parentId];
	const destinationParent = tree.items[destination.parentId];
	if (!sourceParent || !destinationParent) return tree;

	const sourceChildren = [...sourceParent.children];
	const [movedId] = sourceChildren.splice(source.index, 1);
	if (!movedId) return tree;

	const destinationChildren =
		source.parentId === destination.parentId ? sourceChildren : [...destinationParent.children];

	const destinationIndex = destination.index;
	destinationChildren.splice(destinationIndex, 0, movedId);

	const newItems = { ...tree.items };
	newItems[source.parentId] = {
		...newItems[source.parentId],
		children: sourceChildren,
		hasChildren: sourceChildren.length > 0,
	};
	newItems[destination.parentId] = {
		...newItems[destination.parentId],
		children: destinationChildren,
		hasChildren: destinationChildren.length > 0,
	};

	return { ...tree, items: newItems };
};

const getItemPreviewLabel = (item: TreeItem, blockType: any): string => {
	if (item.data.attributes?.label) {
		return getPlainExcerpt(item.data.attributes.label);
	}
	if (blockType?.name === "partial-submission-point") {
		return "Partial Submission Point";
	}
	return "";
};

const SortableTreeItem: React.FC<{
	id: ItemId;
	disabled: boolean;
	children: React.ReactNode;
}> = ({ id, disabled, children }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		disabled,
	});

	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={isDragging ? "dnd-sortable-item is-dragging" : "dnd-sortable-item"}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
		>
			{children}
		</div>
	);
};

const DroppableContainer: React.FC<{
	id: string;
	children: React.ReactNode;
}> = ({ id, children }) => {
	const { setNodeRef, isOver } = useDroppable({ id });
	return (
		<div
			ref={setNodeRef}
			id={id}
			className={isOver ? "dnd-droppable-container is-over" : "dnd-droppable-container"}
		>
			{children}
		</div>
	);
};



const PureTree: React.FC = withErrorBoundary(() => {

	const { blocks, allBlocks, currentPanel, blockTypes, currentBlock, currentChildBlock, currentBlockId, currentChildBlockId } = useSelect((select) => ({
		blocks: select("quillForms/block-editor").getBlocks(true),
		allBlocks: select("quillForms/block-editor").getAllBlocks(),
		blockTypes: select("quillForms/blocks").getBlockTypes(),
		currentBlockId: select("quillForms/block-editor").getCurrentBlockId(),
		currentChildBlockId: select("quillForms/block-editor").getCurrentChildBlockId(),
		currentChildBlock: select("quillForms/block-editor").getCurrentChildBlock(),
		currentBlock: select('quillForms/block-editor').getCurrentBlock(),
		currentPanel: select("quillForms/builder-panels").getCurrentPanel(),        // @ts-ignore
	}));

	const partialSubmissionIndex = blocks.findIndex(block => block.name === 'partial-submission-point');
	const [showPartialSubmissionPointAlert, setShowPartialSubmissionPointAlert] = useState(false);
	const [triggerTreeCalculation, setTriggerTreeCalculation] = useState(false);
	const [activeDragId, setActiveDragId] = useState<ItemId | null>(null);
	const currentBlockLabel = currentBlock?.attributes?.label
	let currentChildBlockLabel;
	if (currentChildBlockId) {
		const childBlock = currentBlock?.innerBlocks?.find(b => b.id === currentChildBlockId);
		currentChildBlockLabel = childBlock?.attributes?.label;
	}

	const allBlocksLength = allBlocks.length;

	const { setBlocks, setCurrentBlock, setCurrentChildBlock } = useDispatch("quillForms/block-editor");
	const { setCurrentPanel } = useDispatch("quillForms/builder-panels");

	// Prevent "click = drag" by requiring pointer movement before drag starts.
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		})
	);

	// Initialize tree state with memoized transformation
	const [tree, setTree] = useState<TreeData>(() =>
		treeUtils.transformBlocksToTree(blocks, blockTypes)
	);

	useEffect(() => {
		if (size(blocks) > 0) {
			setCurrentBlock(blocks[0].id);
		}
	}, []);
	let timeFn;
	// Add a blocks dependency to trigger recalculation
	useEffect(() => {
		clearTimeout(timeFn)
		timeFn = setTimeout(() => {
			setTriggerTreeCalculation(true);

		}, 200)
	}, [currentChildBlockLabel, currentBlockLabel, currentBlock?.attributes, currentChildBlock?.attributes, currentBlockId, currentChildBlockId, currentPanel, allBlocksLength]);

	// Modify the tree transformation to preserve expansion state
	const updateTree = useCallback(() => {
		setTree(prevTree => {
			const newTree = treeUtils.transformBlocksToTree(blocks, blockTypes, prevTree);
			return treeUtils.sortTreeItems(newTree, blockTypes);
		});
	}, [blocks, blockTypes]);

	useEffect(() => {
		if (triggerTreeCalculation) {
			updateTree();
			setTriggerTreeCalculation(false);
		}
	}, [triggerTreeCalculation, updateTree]);

	const isDragEnabled = useCallback((item: TreeItem) => {
		const parentId = findParentId(tree, item.id);
		const parent = parentId ? tree.items[parentId] : null;
		return !(
			item.data.name === "welcome-screen" ||
			(parent?.data.name === "group" && parent.children.length === 1)
		);
	}, [tree]);

	const getSourceFromItemId = useCallback((itemId: ItemId): TreeSourcePosition | null => {
		const parentId = findParentId(tree, itemId);
		if (!parentId) return null;
		const index = tree.items[parentId].children.indexOf(itemId);
		if (index < 0) return null;
		return { parentId, index };
	}, [tree]);

	const getDestinationFromOverId = useCallback(
		(overId: ItemId): TreeDestinationPosition | null => {
			if (isContainerId(overId)) {
				const parentId = parseContainerId(overId);
				const parent = tree.items[parentId];
				if (!parent) return null;
				return { parentId, index: parent.children.length };
			}

			const parentId = findParentId(tree, overId);
			if (!parentId) return null;
			const index = tree.items[parentId].children.indexOf(overId);
			if (index < 0) return null;
			return { parentId, index };
		},
		[tree]
	);

	// Fix for group expansion
	const onExpand = useCallback((itemId: ItemId) => {
		setTree(prevTree => {
			const newTree = { ...prevTree };
			newTree.items = { ...prevTree.items };
			newTree.items[itemId] = {
				...prevTree.items[itemId],
				isExpanded: true
			};
			return newTree;
		});
	}, []);

	const onCollapse = useCallback((itemId: ItemId) => {
		setTree(prevTree => {
			const newTree = { ...prevTree };
			newTree.items = { ...prevTree.items };
			newTree.items[itemId] = {
				...prevTree.items[itemId],
				isExpanded: false
			};
			return newTree;
		});
	}, []);

	const renderItem = useCallback(
		({ item, depth, parentId, childrenContent }: RenderItemParams) => {
			const itemName = item.data.name;
			const blockType = blockTypes[itemName];
			const isGroup = itemName === "group";
			const isChildBlock = depth > 0;
			const isItemActive = isGroup
				? currentBlockId === item.id && !currentChildBlockId
				: currentChildBlockId === item.id ||
				(!isChildBlock && currentBlockId === item.id && !currentChildBlockId);

			const hasNoChildren = isGroup && (!item.children || item.children.length === 0);
			const isLastInGroup = (() => {

				if (!parentId) return false;

				const parent = tree.items[parentId];
				const isParentGroup = tree.items[parentId]?.data?.name === 'group';
				return isParentGroup && parent.children[parent.children.length - 1] === item.id;
			})();

			const isPartialSubmissionPoint = itemName === 'partial-submission-point';

			const filteredBlocks = blocks.filter(block => {
				return block['name'] !== 'welcome-screen' && block['name'] !== 'thankyou-screen';
			});

			// Get actual index excluding welcome and thank you screens
			const getEffectiveIndex = (itemId: ItemId) => {

				return filteredBlocks.findIndex(block => block.id === itemId);
			};

			const effectiveIndex = isPartialSubmissionPoint ? getEffectiveIndex(item.id) : -1;
			const isFirstOrLast = effectiveIndex === 0 ||
				(effectiveIndex === filteredBlocks.length - 1);



			// Calculate disableDelete prop
			const isOnlyBlock = tree.items.root.children.length === 1;
			const isOnlyChildInGroup = isChildBlock && parentId && tree.items[parentId].children.length === 1;
			const disableDelete = Boolean((!isChildBlock && isOnlyBlock) || isOnlyChildInGroup);

			return (
				<div
					onClick={(e) => {
						// Children are rendered inside the group header container,
						// so we must stop bubbling to avoid parent group click clearing selection.
						if (isChildBlock) e.stopPropagation();
						if (isChildBlock) {
							// Use the actual parent from the tree to keep selection in sync.
							const actualParentId = findParentId(tree, item.id);
							if (actualParentId) setCurrentBlock(actualParentId);
							setCurrentChildBlock(item.id);
						}
						else {
							setCurrentBlock(item.id);
							// When selecting group header, highlight header only (child not selected).
							setCurrentChildBlock(undefined as any);
						}
					}}
					className={`block-item ${isGroup ? "group-block" : ""} ${isGroup && !item.isExpanded ? "group-block-collapsed" : ""} ${isChildBlock ? "child-block" : ""
						} ${isLastInGroup ? "last-in-group" : ""}` + (isItemActive ? " active" : "")}
				>
					<div className={`block-content ${isGroup ? "group-header" : ""}`}>

						{isGroup && item.children.length > 0 && (
							<div
								className="collapse-icon"
								onPointerDown={(e) => {
									// Prevent dnd-kit from treating chevron click as drag start.
									e.stopPropagation();
								}}
								onMouseDown={(e) => {
									e.stopPropagation();
								}}
								onTouchStart={(e) => {
									e.stopPropagation();
								}}
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
									if (item.isExpanded) {
										onCollapse(item.id);
									}
									else {
										onExpand(item.id);

									}
								}
								}
							>
								<svg
									className={`icon ${item.isExpanded ? "expanded" : ""}`}
									viewBox="0 0 24 24"
									width="16"
									height="16"
								>
									<path
										d="M9 18L15 12L9 6"
										stroke="currentColor"
										strokeWidth="2"
										fill="none"
									/>
								</svg>
							</div>
						)}
						<BlockIconBox
							icon={isGroup ? (LIST_BLOCK_ICON as any) : blockType?.icon}
							order={item.data.blockOrder}
							color={"#FFEEFB"}
						/>
						{item.data.attributes?.label && (
							<span
								className="block-label"
								dangerouslySetInnerHTML={{
									__html: getPlainExcerpt(item.data.attributes.label),
								}}
							/>
						)}
						{blockType?.name === 'partial-submission-point' && (
							<span className="block-label">Partial Submission Point</span>
						)}
						{isPartialSubmissionPoint && isFirstOrLast && (
							<div
								className="warning-icon warning-icon--partial-submission"
								onClick={() => {
									setShowPartialSubmissionPointAlert(true);
								}}
							>

								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" />
									<path
										d="M12 8V12"
										stroke="#f59e0b"
										strokeWidth="2"
										strokeLinecap="round"
									/>
									<circle cx="12" cy="16" r="1" fill="#f59e0b" />
								</svg>
							</div>
						)}
						<BlockActions
							onAction={() => {
								setTriggerTreeCalculation(true);
							}}
							id={item.id}
							parentId={parentId}
							disableDelete={disableDelete}
						/>
					</div>
					{
						hasNoChildren && (
							<div
								className="group-placeholder"
							>

							</div>
						)
					}
					{isGroup && item.isExpanded && (
						<div className="group-block-children-wrapper">{childrenContent}</div>
					)}
				</div >
			);
		},
		[blockTypes, tree, blocks, onExpand, onCollapse, currentBlockId, currentChildBlockId]
	);

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			setActiveDragId(null);
			const activeId = String(event.active.id);
			const overId = event.over ? String(event.over.id) : "";
			if (!overId) return;

			const source = getSourceFromItemId(activeId);
			const destination = getDestinationFromOverId(overId) || undefined;
			if (!source) return;

			// Early return if move is invalid
			if (!destination || !blockUtils.isValidMove(source, destination, tree, blocks)) {
				return;
			}



			const sourceItem = tree.items[tree.items[source.parentId].children[source.index]];
			let sourceParentIndex: number | undefined = undefined;
			let destinationParentIndex: number | undefined = undefined;
			if (source.parentId !== 'root') {
				//sourceParentIndex = tree.items[tree.items[source.parentId].children[source.index]].data.blockOrder;
				// the previous is wrong
				sourceParentIndex = blocks.findIndex((block) => block.id === source.parentId);
			}
			if (destination.parentId !== 'root') {
				destinationParentIndex = blocks.findIndex((block) => block.id === destination.parentId);
			}

			const destinationItem = tree.items[destination.parentId];

			const handleBlockMove = () => {
				// First move the items
				let newTree = moveItemOnTree(tree, source, destination);

				// Then sort and recalculate orders
				newTree = treeUtils.sortTreeItems(newTree, blockTypes);

				// Update states
				updateBlockSelections(source, destination, sourceItem, destinationItem);
				setBlocks(treeUtils.rebuildBlocks(newTree));
				setTree(newTree);
			};


			const updateBlockSelections = (
				source: TreeSourcePosition,
				destination: TreeDestinationPosition,
				sourceItem: TreeItem,
				destinationItem: TreeItem
			) => {
				// Handle child block movement
				if (source.parentId !== 'root' && currentChildBlockId === sourceItem.id) {
					if (destination.parentId === 'root') {
						setCurrentChildBlock(undefined as any);
						setCurrentBlock(sourceItem.id);
					} else {
						setCurrentBlock(destinationItem.id);
					}
				}

				// Handle current block selection
				if (sourceItem.id === currentBlockId &&
					source.parentId === 'root' &&
					destination.parentId !== 'root') {
					setCurrentBlock(destinationItem.id);
					setCurrentChildBlock(sourceItem.id);
				}
			};

			let dragSourceIndex = source.index;
			let dragSourceParentIndex: number | undefined = sourceParentIndex;
			let dragDestinationIndex = destination.index;
			let dragDestinationParentIndex: number | undefined = destinationParentIndex;

			// Handle partial submission point
			if (partialSubmissionIndex !== -1) {
				if (source.parentId === 'root') {
					dragSourceIndex = source.index > partialSubmissionIndex ? source.index - 1 : source.index;
				}
				else if (typeof sourceParentIndex === 'number') {
					dragSourceParentIndex = sourceParentIndex > partialSubmissionIndex ? sourceParentIndex - 1 : sourceParentIndex;
				}
				if (destination.parentId === 'root') {
					if (typeof destination.index === 'number') {
						dragDestinationIndex = destination?.index > partialSubmissionIndex ? destination.index - 1 : destination.index;
					}
				}
				else if (typeof destinationParentIndex === 'number') {
					dragDestinationParentIndex = destinationParentIndex > partialSubmissionIndex ? destinationParentIndex - 1 : destinationParentIndex;
				}



			}

			const handleDragAlerts = () => {

				let dragAlerts: string[] = [];
				if (sourceItem.id !== 'partial-submission-point') {
					dragAlerts = dragAlerts.concat(
						applyFilters(
							'QuillForms.BuilderCore.BlockReorderAlerts',
							[],
							dragSourceIndex,
							dragDestinationIndex,
							dragSourceParentIndex,
							dragDestinationParentIndex
						) as string[]
					);
				}
				return dragAlerts;
			};

			const showDragAlert = (dragAlerts: string[]) => {
				confirmAlert({
					customUI: ({ onClose }) => (
						<DragAlert
							messages={dragAlerts}
							approve={() => {
								doAction(
									'QuillForms.BuilderCore.BlockReorder',
									dragSourceIndex,
									dragDestinationIndex,
									dragSourceParentIndex,
									dragDestinationParentIndex
								);
								handleBlockMove();
								onClose();
							}}
							reject={onClose}
							closeModal={onClose}
						/>
					),
				});
			};

			// Main execution flow
			const dragAlerts = handleDragAlerts();
			if (dragAlerts.length > 0) {
				showDragAlert(dragAlerts);
			} else {
				handleBlockMove();
			}
		},
		[
			tree,
			blocks,
			currentBlock,
			currentChildBlock,
			currentBlockId,
			currentChildBlockId,
			setBlocks,
			setCurrentBlock,
			setCurrentChildBlock,
			getSourceFromItemId,
			getDestinationFromOverId,
			blockTypes,
		]
	);

	const onDragStart = useCallback((event: DragStartEvent) => {
		setActiveDragId(String(event.active.id));
	}, []);

	const onDragCancel = useCallback(() => {
		setActiveDragId(null);
	}, []);

	// if (!currentBlock) return null;

	const renderTreeLevel = (parentId: ItemId, depth: number) => {
		const parent = tree.items[parentId];
		if (!parent) return null;
		return (
			<SortableContext items={parent.children} strategy={verticalListSortingStrategy}>
				<DroppableContainer id={getContainerId(parentId)}>
					{parent.children.map((childId) => {
						const child = tree.items[childId];
						if (!child) return null;
						const childChildrenContent =
							child.data.name === "group" && child.isExpanded
								? renderTreeLevel(child.id, depth + 1)
								: null;
						const childItem = (
							<SortableTreeItem key={child.id} id={child.id} disabled={!isDragEnabled(child)}>
								<div style={{ paddingLeft: `${depth * 16}px` }}>
									{renderItem({
										item: child,
										depth,
										parentId,
										childrenContent: childChildrenContent,
									})}
								</div>
							</SortableTreeItem>
						);
						return childItem;
					})}
				</DroppableContainer>
			</SortableContext>
		);
	};

	const activeDragItem = activeDragId ? tree.items[activeDragId] : undefined;
	const activeDragBlockType = activeDragItem ? blockTypes[activeDragItem.data.name] : undefined;
	const activePreviewLabel = activeDragItem ? getItemPreviewLabel(activeDragItem, activeDragBlockType) : "";

	return (
		<div className="builder-core-blocks-list__wrapper">
			<div className="builder-core-blocks-list">
				<BlockTreeErrorBoundary>
					<DndContext
						collisionDetection={closestCenter}
						sensors={sensors}
						onDragStart={onDragStart}
						onDragEnd={onDragEnd}
						onDragCancel={onDragCancel}
					>
						{renderTreeLevel("root", 0)}
						<DragOverlay dropAnimation={null}>
							{activeDragItem ? (
								<div className={`builder-core-drag-overlay ${activeDragItem.data.name === "group" ? "builder-core-drag-overlay--group" : ""}`}>
									<div className="builder-core-drag-overlay__content block-content">
										<BlockIconBox
											icon={activeDragItem.data.name === "group" ? (LIST_BLOCK_ICON as any) : activeDragBlockType?.icon}
											order={activeDragItem.data.blockOrder}
											color={"#FFEEFB"}
										/>
										{activePreviewLabel && (
											<span
												className="builder-core-drag-overlay__label"
												dangerouslySetInnerHTML={{
													__html: activePreviewLabel,
												}}
											/>
										)}
									</div>
									{activeDragItem.data.name === "group" && activeDragItem.children.length > 0 && (
										<div className="builder-core-drag-overlay__group-children">
											{activeDragItem.children.map((childId) => {
												const child = tree.items[childId];
												if (!child) return null;
												const childType = blockTypes[child.data.name];
												const childLabel = getItemPreviewLabel(child, childType);
												return (
													<div key={child.id} className="builder-core-drag-overlay__group-child">
														<BlockIconBox
															icon={child.data.name === "group" ? (LIST_BLOCK_ICON as any) : childType?.icon}
															order={child.data.blockOrder}
															color={"#FFEEFB"}
														/>
														{childLabel && (
															<span
																className="builder-core-drag-overlay__label"
																dangerouslySetInnerHTML={{ __html: childLabel }}
															/>
														)}
													</div>
												);
											})}
										</div>
									)}
								</div>
							) : null}
						</DragOverlay>
					</DndContext>
				</BlockTreeErrorBoundary>
			</div>
			<div className="builder-core-blocks-list__add-question">
				<div className="builder-core-blocks-list__add-question-separator" />
				<button
					type="button"
					className="builder-core-blocks-list__add-question-btn"
					onClick={() => setCurrentPanel("add-questions")}
				>
					<span className="builder-core-blocks-list__add-question-btn-plus">+</span>
					{__("Add a question", "quillforms")}
				</button>
			</div>
			{showPartialSubmissionPointAlert && (
				<Modal
					title={__('Partial Submission Point Alert', 'quillforms')}
					onRequestClose={() => setShowPartialSubmissionPointAlert(false)}
				>
					<div>
						<p>
							<strong>{__('Partial Submission Point', 'quillforms')}</strong> {__('shouldn\'t be the first or the last field.', 'quillforms')}
						</p>
					</div>
				</Modal>
			)}
		</div>
	);
}, {
	title: 'Error in Block Tree',
	message: 'An error occurred while rendering the block tree. Please click on "Try again" or try refreshing the page.',
	showDetails: true
});

export default PureTree;

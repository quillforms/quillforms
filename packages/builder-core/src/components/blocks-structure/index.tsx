import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import Tree, {
    mutateTree,
    moveItemOnTree,
    type RenderItemParams,
    type TreeItem,
    type TreeData,
    type ItemId,
    type TreeSourcePosition,
    type TreeDestinationPosition,
} from "@atlaskit/tree";
import { identAlphabetically } from "@quillforms/utils";

import { BlockIconBox, getPlainExcerpt } from "@quillforms/admin-components";
import { BlockActions } from "@quillforms/block-editor";

import { doAction, applyFilters } from '@wordpress/hooks';

import { useSelect, useDispatch } from "@wordpress/data";
import DragAlert from '../drag-alert';
import { FormBlock, FormBlocks } from "@quillforms/types";
import { size } from "lodash";
import { confirmAlert } from 'react-confirm-alert';



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



// Styles
const PADDING_PER_LEVEL = 16;
const PreTextIcon = styled.span({
    display: "inline-block",
    width: "16px",
    justifyContent: "center",
    cursor: "pointer",
});



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

            // Thank you screen cannot be in group
            sourceBlockName === 'thankyou-screen' && destinationParentBlockName === 'group'
        ];

        return !invalidConditions.some(condition => condition === true);
    }
};

const treeUtils = {
    processBlocks(
        blocks: FormBlocks,
        items: Record<ItemId, TreeItem>,
        parentId: ItemId = "root",
        parentOrder = ""
    ): void {
        blocks.forEach((block, index) => {
            const blockOrder = parentId === "root"
                ? (index + 1).toString()
                : `${parentOrder}${identAlphabetically(index)}`;

            items[block.id] = {
                id: block.id,
                children: block.innerBlocks?.map(b => b.id) || [],
                hasChildren: !!block.innerBlocks?.length,
                isExpanded: true,
                data: {
                    name: block.name,
                    attributes: block.attributes,
                    blockOrder,
                },
            };

            if (block.innerBlocks?.length) {
                treeUtils.processBlocks(block.innerBlocks, items, block.id, blockOrder);
            }
        });
    },

    transformBlocksToTree(blocks: FormBlocks): TreeData {
        const items: Record<ItemId, TreeItem> = {
            root: {
                id: "root",
                children: blocks.map(block => block.id),
                hasChildren: true,
                isExpanded: true,
                data: { title: "Root" },
            },
        };

        treeUtils.processBlocks(blocks, items);
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
                    : undefined,
            } as Block;
        });
    },

    recalculateBlockOrder(
        tree: TreeData,
        parentId: ItemId = "root",
        parentOrder = ""
    ): void {
        const item = tree.items[parentId];
        item.children.forEach((childId, index) => {
            const child = tree.items[childId];
            const blockOrder = parentOrder
                ? `${parentOrder}${identAlphabetically(index)}`
                : (index + 1).toString();

            child.data.blockOrder = blockOrder;

            if (child.hasChildren) {
                treeUtils.recalculateBlockOrder(tree, child.id, blockOrder);
            }
        });
    },
    sortTreeItems(tree: TreeData): TreeData {
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

        // Recalculate block orders for the entire tree
        treeUtils.recalculateBlockOrder(newTree);

        return newTree;
    }
};



const PureTree: React.FC = () => {

    const { blocks, currentPanel, blockTypes, currentBlock, currentBlockId, currentChildBlockId } = useSelect((select) => ({
        blocks: select("quillForms/block-editor").getBlocks(),
        blockTypes: select("quillForms/blocks").getBlockTypes(),
        currentBlockId: select("quillForms/block-editor").getCurrentBlockId(),
        currentChildBlockId: select("quillForms/block-editor").getCurrentChildBlockId(),
        currentBlock: select('quillForms/block-editor').getCurrentBlock(),
        currentPanel: select("quillForms/builder-panels").getCurrentPanel(),
    }));
    const [triggerTreeCalculation, setTriggerTreeCalculation] = useState(false);
    if (!currentBlock) return null;

    const currentBlockLabel = currentBlock?.attributes?.label
    let currentChildBlockLabel;
    if (currentChildBlockId) {
        const childBlock = currentBlock?.innerBlocks?.find(b => b.id === currentChildBlockId);
        currentChildBlockLabel = childBlock?.attributes?.label;
    }
    useEffect(() => {
        if (triggerTreeCalculation) {
            setTree(treeUtils.transformBlocksToTree(blocks));
            setTriggerTreeCalculation(false);
        }
    }, [triggerTreeCalculation]);

    useEffect(() => {
        setTriggerTreeCalculation(true);
    }, [currentBlockLabel, currentChildBlockLabel, currentPanel]);

    const { setBlocks, setCurrentBlock, setCurrentChildBlock } = useDispatch("quillForms/block-editor");

    // Initialize tree state with memoized transformation
    const [tree, setTree] = useState<TreeData>(() =>
        treeUtils.transformBlocksToTree(blocks)
    );

    // Updated renderItem with better styling for group children
    const renderItem = useCallback(
        ({ item, depth, onExpand, onCollapse, provided, snapshot }: RenderItemParams) => {
            const itemName = item.data.name;
            const blockType = blockTypes[itemName];
            const isGroup = itemName === "group";
            const isChildBlock = depth > 0;
            const hasNoChildren = isGroup && (!item.children || item.children.length === 0);
            let parentId;
            if (isChildBlock) {
                parentId = Object.keys(tree.items).find(key =>
                    tree.items[key].children.includes(item.id)
                );
            }
            const isLastInGroup = (() => {

                if (!parentId) return false;

                const parent = tree.items[parentId];
                const isParentGroup = tree.items[parentId]?.data?.name === 'group';
                return isParentGroup && parent.children[parent.children.length - 1] === item.id;
            })();

            const groupWrapperStyles = isGroup
                ? {
                    background: item.isExpanded ? "#f9fafb" : "#f1f5f9",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    marginBottom: item.isExpanded ? "16px" : "8px",
                    boxShadow: item.isExpanded
                        ? "0 2px 6px rgba(0, 0, 0, 0.05)"
                        : "none",
                }
                : {};

            return (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => {
                        if (isChildBlock) {
                            setCurrentBlock(parentId);
                            setCurrentChildBlock(item.id);
                        }
                        else {
                            setCurrentBlock(item.id);
                            setCurrentChildBlock(undefined);
                        }
                    }}
                    className={`block-item ${isGroup ? "group-block" : ""} ${isChildBlock ? "child-block" : ""
                        } ${isLastInGroup ? "last-in-group" : ""}` + (currentBlockId === item.id && !currentChildBlockId ? " active" : "") + (currentChildBlockId === item.id ? " active" : "")}
                    style={{
                        ...provided.draggableProps.style,
                        ...(isGroup ? groupWrapperStyles : {}),
                        ...(snapshot.isDragging
                            ? { boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", opacity: 0.9 }
                            : {}),
                    }}
                >
                    <div className="block-content">

                        {isGroup && item.children.length > 0 && (
                            <div
                                className="collapse-icon"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (item.isExpanded) {
                                        onCollapse(item.id)
                                    }
                                    else {
                                        onExpand(item.id)

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
                            icon={blockType?.icon}
                            order={item.data.blockOrder}
                            color={blockType?.color}
                        />
                        {item.data.attributes?.label && (
                            <span
                                className="block-label"
                                dangerouslySetInnerHTML={{
                                    __html: getPlainExcerpt(item.data.attributes.label),
                                }}
                            />
                        )}
                        <BlockActions onAction={() => {
                            setTriggerTreeCalculation(true);
                        }} id={item.id} parentId={parentId} />
                    </div>
                    {
                        hasNoChildren && (
                            <div
                                className="group-placeholder"
                                style={{
                                    width: '100%',
                                    height: "40px",
                                    margin: "8px 0",
                                    border: `2px dashed ${snapshot.isDragging ? '#60a5fa' : '#cbd5e1'}`,
                                    borderRadius: "6px",
                                    background: snapshot.isDragging ? '#f0f9ff' : '#ffffff',
                                    textAlign: "center",
                                    color: "#64748b",
                                    fontSize: "14px",
                                    transition: 'all 0.2s ease',
                                }}
                            >

                            </div>
                        )
                    }
                </div >
            );
        },
        [blockTypes, tree, blocks]
    );

    const onDragEnd = useCallback(
        (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
            // Early return if move is invalid
            if (!destination || !blockUtils.isValidMove(source, destination, tree, blocks)) {
                return;
            }

            const sourceItem = tree.items[tree.items[source.parentId].children[source.index]];
            let sourceParentIndex = undefined;
            let destinationParentIndex = undefined;
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
                // Move items and sort the tree
                const newTree = treeUtils.sortTreeItems(
                    moveItemOnTree(tree, source, destination)
                );

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
                        setCurrentChildBlock(undefined);
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

            const handleDragAlerts = () => {
                let dragAlerts: string[] = [];
                dragAlerts = dragAlerts.concat(
                    applyFilters(
                        'QuillForms.BuilderCore.BlockReorderAlerts',
                        [],
                        source.index,
                        destination.index,
                        sourceParentIndex,
                        destinationParentIndex
                    ) as string[]
                );
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
                                    source.index,
                                    destination.index,
                                    sourceParentIndex,
                                    destinationParentIndex
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
        [tree, blocks, currentBlockId, currentChildBlockId, setBlocks, setCurrentBlock, setCurrentChildBlock]
    );

    return (
        <div className="builder-core-blocks-list__wrapper">
            <div className="builder-core-blocks-list">
                <Tree
                    tree={tree}
                    renderItem={renderItem}
                    onExpand={useCallback((itemId: ItemId) => {
                        setTree(prevTree => mutateTree(prevTree, itemId, { isExpanded: true }));
                    }, [])}
                    onCollapse={useCallback((itemId: ItemId) => {
                        setTree(prevTree => mutateTree(prevTree, itemId, { isExpanded: false }));
                    }, [])}
                    onDragEnd={onDragEnd}
                    onDragStart={(itemId) => {
                        // check if the item i welcome screen block
                        const item = tree.items[itemId];
                        if (item.data.name === 'welcome-screen') return;
                    }}
                    offsetPerLevel={PADDING_PER_LEVEL}
                    isDragEnabled={(item) => {
                        // Get parent item if exists
                        const parentId = Object.keys(tree.items).find(key =>
                            tree.items[key].children.includes(item.id)
                        );
                        const parent = parentId ? tree.items[parentId] : null;

                        // Disable dragging if:
                        // 1. Item is a welcome-screen block OR
                        // 2. Item is the only child in a group block
                        return !(
                            item.data.name === "welcome-screen" ||
                            (parent?.data.name === "group" && parent.children.length === 1)
                        );
                    }}

                />
            </div>
        </div>
    );
};

export default PureTree;

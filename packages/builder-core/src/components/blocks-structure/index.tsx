import React, { useState, useCallback } from "react";
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

import { useSelect, useDispatch } from "@wordpress/data";
import { de } from "date-fns/locale";

// Your custom block structure
type Attributes = {
    [key: string]: any;
};

type Block = {
    id: ItemId;
    name: string;
    attributes: Attributes;
    innerBlocks?: Block[];
};

// Helper function to get alphabetical identifier
const getAlphabeticalIdentifier = (index: number): string => {
    return String.fromCharCode(97 + index); // 97 is 'a' in ASCII
};

// Transform `blocks` array into `TreeData`
const transformBlocksToTree = (blocks: Block[]): TreeData => {
    const rootId = "root";
    const items: Record<ItemId, TreeItem> = {};

    items[rootId] = {
        id: rootId,
        children: blocks.map((block) => block.id),
        hasChildren: true,
        isExpanded: true,
        data: { title: "Root" },
    };

    const processBlocks = (blocks: Block[], parentId: ItemId = rootId, parentOrder?: string) => {
        blocks.forEach((block, index) => {
            let blockOrder: string;
            if (parentId === rootId) {
                blockOrder = (index + 1).toString();
            } else {
                blockOrder = `${parentOrder}${identAlphabetically(index)}`;
            }

            items[block.id] = {
                id: block.id,
                children: block.innerBlocks ? block.innerBlocks.map((b) => b.id) : [],
                hasChildren: !!block.innerBlocks?.length,
                isExpanded: true,
                data: {
                    name: block.name,
                    attributes: block.attributes,
                    blockOrder: blockOrder,
                },
            };

            if (block.innerBlocks) {
                processBlocks(block.innerBlocks, block.id, blockOrder);
            }
        });
    };

    processBlocks(blocks);
    return { rootId, items };
};

// Utility to rebuild `blocks` from `TreeData`
const rebuildBlocksFromTree = (tree: TreeData, rootId: ItemId = "root"): Block[] => {
    const rebuild = (id: ItemId, parentOrder = ""): Block[] => {
        const item = tree.items[id];

        return item.children.map((childId, index) => {
            const child = tree.items[childId];

            // Recalculate the block order dynamically
            const blockOrder = parentOrder
                ? `${parentOrder}${identAlphabetically(index)}`
                : (index + 1).toString();

            return {
                id: child.id,
                ...child.data,
                blockOrder, // Update blockOrder
                innerBlocks: child.hasChildren ? rebuild(child.id, blockOrder) : undefined,
            } as Block;
        });
    };

    return rebuild(rootId);
};

// Styles
const PADDING_PER_LEVEL = 16;
const PreTextIcon = styled.span({
    display: "inline-block",
    width: "16px",
    justifyContent: "center",
    cursor: "pointer",
});



// Main Functional Component
const PureTree: React.FC = () => {
    const { blocks, blockTypes } = useSelect((select) => {
        return {
            blocks: select("quillForms/block-editor").getBlocks(),
            blockTypes: select("quillForms/blocks").getBlockTypes(),
        };
    });

    const { setBlocks } = useDispatch("quillForms/block-editor");
    const [tree, setTree] = useState<TreeData>(transformBlocksToTree(blocks)); // Convert blocks to TreeData
    const { setCurrentBlock, setCurrentChildBlock } = useDispatch("quillForms/block-editor");



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
                        }
                    }}
                    className={`block-item ${isGroup ? "group-block" : ""} ${isChildBlock ? "child-block" : ""
                        } ${isLastInGroup ? "last-in-group" : ""}`}
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
                                onClick={() => (item.isExpanded ? onCollapse(item.id) : onExpand(item.id))}
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
                    </div>
                    {hasNoChildren && (
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
                    )}
                </div>
            );
        },
        [blockTypes, tree]
    );

    // Expand handler
    const onExpand = useCallback(
        (itemId: ItemId) => {
            setTree((prevTree) => mutateTree(prevTree, itemId, { isExpanded: true }));
        },
        []
    );

    // Collapse handler
    const onCollapse = useCallback(
        (itemId: ItemId) => {
            setTree((prevTree) => mutateTree(prevTree, itemId, { isExpanded: false }));
        },
        []
    );

    // Drag end handler
    // Drag end handler
    const onDragEnd = useCallback(
        (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
            if (!destination) {
                return;
            }

            const sourceItem = tree.items[tree.items[source.parentId].children[source.index]];
            const sourceBlockName = sourceItem.data.name;

            // Get the destination parent's block name
            const destinationParentItem = tree.items[destination.parentId];
            const destinationParentBlockName = destinationParentItem.data.name;

            // Prevent nesting if:
            // 1. Destination parent is not root AND not a group block
            // 2. Welcome screen movement restrictions
            // 3. Group blocks can only be at root level
            if (
                // Prevent nesting in non-group blocks
                (destination.parentId !== "root" && destinationParentBlockName !== "group") ||
                // Welcome screen restrictions
                (destination.index === 0 &&
                    destination.parentId === "root" &&
                    blocks[0].name === "welcome-screen") ||
                (source.index === 0 &&
                    source.parentId === "root" &&
                    blocks[0].name === "welcome-screen") ||
                // Group blocks can only be at root level
                (sourceBlockName === "group" && destination.parentId !== "root")
            ) {
                return;
            }

            // Move the item on the tree
            const newTree = moveItemOnTree(tree, source, destination);

            // Recalculate block order dynamically after the move
            const recalculateBlockOrder = (tree: TreeData, parentId: ItemId = "root", parentOrder = "") => {
                const item = tree.items[parentId];

                item.children.forEach((childId, index) => {
                    const child = tree.items[childId];
                    const blockOrder = parentOrder
                        ? `${parentOrder}${identAlphabetically(index)}`
                        : (index + 1).toString();
                    child.data.blockOrder = blockOrder;

                    if (child.hasChildren) {
                        recalculateBlockOrder(tree, child.id, blockOrder);
                    }
                });
            };

            recalculateBlockOrder(newTree);

            // Rebuild the blocks array from the updated tree
            const newBlocks = rebuildBlocksFromTree(newTree);

            // Update the state and the blocks in the editor
            setTree(newTree);
            setBlocks(newBlocks);
        },
        [tree, blocks, setBlocks]
    );

    return (
        <div className="builder-core-blocks-list__wrapper">
            <div className="builder-core-blocks-list">
                <Tree
                    tree={tree}
                    renderItem={renderItem}
                    onExpand={onExpand}
                    onCollapse={onCollapse}
                    onDragEnd={onDragEnd}
                    offsetPerLevel={PADDING_PER_LEVEL}
                    isDragEnabled
                />
            </div>
        </div>
    );
};

export default PureTree;
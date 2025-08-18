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
                isExpanded: prevItems?.[block.id]?.isExpanded ?? true, // Preserve expansion state
                data: {
                    name: block.name,
                    attributes: block.attributes,
                    blockOrder,
                },
            };

            if (block.name === 'group' && block.innerBlocks?.length) {
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
        //console.log('blocks', blocks);
        const items: Record<ItemId, TreeItem> = {
            root: {
                id: "root",
                children: blocks.map(block => block.id),
                hasChildren: true,
                isExpanded: true,
                data: { title: "Root" },
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
                    : undefined,
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

            // Update the block order
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
    const currentBlockLabel = currentBlock?.attributes?.label
    const currentBlockName = currentBlock?.name;
    let currentChildBlockLabel;
    let currentChildBlockName;
    if (currentChildBlockId) {
        const childBlock = currentBlock?.innerBlocks?.find(b => b.id === currentChildBlockId);
        currentChildBlockLabel = childBlock?.attributes?.label;
        currentChildBlockName = childBlock?.name;
    }

    const allBlocksLength = allBlocks.length;

    const { setBlocks, setCurrentBlock, setCurrentChildBlock } = useDispatch("quillForms/block-editor");

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
            //console.log('parentId', parentId);
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
            const disableDelete = (!isChildBlock && isOnlyBlock) || isOnlyChildInGroup;

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
                        {blockType?.name === 'partial-submission-point' && (
                            <span className="block-label">Partial Submission Point</span>
                        )}
                        {isPartialSubmissionPoint && isFirstOrLast && (
                            <div
                                className="warning-icon"
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "22px",
                                    color: "#f59e0b",
                                    display: "flex",
                                    alignItems: "center",
                                }}
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

            let dragSourceIndex = source.index;
            let dragSourceParentIndex = sourceParentIndex;
            let dragDestinationIndex = destination.index;
            let dragDestinationParentIndex = destinationParentIndex;

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
        [tree, blocks, currentBlock, currentChildBlock, currentBlockId, currentChildBlockId, setBlocks, setCurrentBlock, setCurrentChildBlock]
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

    // if (!currentBlock) return null;


    return (
        <div className="builder-core-blocks-list__wrapper">
            <div className="builder-core-blocks-list">
                <BlockTreeErrorBoundary>
                    <Tree
                        tree={tree}
                        renderItem={renderItem}
                        onExpand={onExpand}
                        onCollapse={onCollapse}
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
                </BlockTreeErrorBoundary>
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

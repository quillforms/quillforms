import {
    DndContext,
    DragOverlay,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockIconBox } from '@quillforms/admin-components';
import { getPlainExcerpt } from '@quillforms/rich-text';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { useState, useCallback } from 'react';
import classNames from "classnames";

const styles = {
    blocksList: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    block: {
        backgroundColor: '#fff',
        // border: '1px solid #ddd',
        borderRadius: '4px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'pointer',
        // boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
    },
    groupBlock: {
        backgroundColor: '#f8f9fa',
        border: '2px solid #e9ecef',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '12px',
    },
    groupLabel: {
        fontWeight: 'bold',
        color: '#495057',
        marginBottom: '12px',
        padding: '8px',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
    },
    innerBlocksContainer: {
        marginTop: '10px',
        padding: '12px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        minHeight: '50px',
    },
    blockContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    blockName: {
        fontWeight: '500',
        color: '#495057',
    },
    blockLabel: {
        color: '#6c757d',
        fontSize: '0.9em',
    },
    draggingBlock: {
        backgroundColor: '#fff',
        padding: '12px',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '300px',
    },
    dropZone: {
        height: '8px',
        margin: '4px 0',
        backgroundColor: '#e9ecef',
        borderRadius: '4px',
        transition: 'height 0.2s ease',
    },

};

const SortableBlock = ({ block, index, isCollapsed, onToggleCollapse, parentIndex }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: block.id,
        transition: {
            duration: 200,
            easing: 'ease'
        },
        disabled: block.name === 'welcome-screen',
    });

    const { blockType, currentBlockId, currentChildBlockId } = useSelect((select) => ({
        blockType: select('quillForms/blocks').getBlockType(block.name),
        currentBlockId: select('quillForms/block-editor').getCurrentBlockId(),
        currentChildBlockId: select('quillForms/block-editor').getCurrentChildBlockId(),
    }), [block.name]);

    const { blockOrder } = useSelect((select) => ({
        blockOrder: select('quillForms/block-editor').getBlockOrderById(
            block.id,
            parentIndex
        ),
    }), [block.id, parentIndex]);

    if (block.name === 'group') {
        return (
            <div
                ref={setNodeRef}
                style={{ ...styles.groupBlock }}
                {...attributes}
                {...listeners}
                className={classNames('builder-core-blocks-list-group-block', {
                    'collapsed': isCollapsed,
                    'selected': currentBlockId === block.id
                })}
            >
                <div
                    onClick={() => onToggleCollapse(block.id)}
                    className='builder-core-blocks-list-group-label'
                >
                    <BlockIconBox
                        icon={blockType?.icon}
                        order={blockOrder}
                        color={blockType?.color}
                    />
                    {block.attributes?.label && (
                        <span
                            style={styles.blockLabel}
                            dangerouslySetInnerHTML={{
                                __html: getPlainExcerpt(block.attributes.label, 50)
                            }}
                        />
                    )}
                    <span style={{ marginLeft: '8px' }}>
                        {isCollapsed ? '▼' : '▲'}
                    </span>
                </div>

                {!isCollapsed && (
                    <div style={styles.innerBlocksContainer}>
                        <SortableContext
                            items={block.innerBlocks?.map(b => b.id) || []}
                            strategy={verticalListSortingStrategy}
                        >
                            {block.innerBlocks?.map((innerBlock, innerIndex) => (
                                <SortableBlock
                                    key={innerBlock.id}
                                    block={innerBlock}
                                    index={innerIndex}
                                    isCollapsed={false}
                                    parentIndex={index}
                                    onToggleCollapse={onToggleCollapse}
                                />
                            ))}
                        </SortableContext>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={{ ...styles.block }}
            {...attributes}
            {...listeners}
            className={classNames('builder-core-blocks-list-block', {
                'selected': currentBlockId === block.id,
                'child-selected': currentChildBlockId === block.id
            })}
        >
            <div style={styles.blockContent}>
                <BlockIconBox
                    icon={blockType?.icon}
                    order={blockOrder}
                    color={blockType?.color}
                />
                {block.attributes?.label && (
                    <span
                        style={styles.blockLabel}
                        dangerouslySetInnerHTML={{
                            __html: getPlainExcerpt(block.attributes.label)
                        }}
                    />
                )}
            </div>
        </div>
    );
};


const BlocksList = () => {
    const { formBlocks } = useSelect(select => ({
        formBlocks: select('quillForms/block-editor').getBlocks()
    }));

    // Separate blocks into three sections
    const welcomeScreen = formBlocks.find(block => block.name === 'welcome-screen');
    const thankYouScreens = formBlocks.filter(block => block.name === 'thank-you-screen');
    const mainBlocks = formBlocks.filter(block =>
        block.name !== 'welcome-screen' && block.name !== 'thank-you-screen'
    );

    const { __experimentalReorderBlocks } = useDispatch('quillForms/block-editor');
    const [activeId, setActiveId] = useState(null);
    const [collapsedGroups, setCollapsedGroups] = useState({});
    const [activeBlock, setActiveBlock] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findBlockInfo = (blocks, searchId, parentIndex = undefined) => {
        for (let i = 0; i < blocks.length; i++) {
            if (blocks[i].id === searchId) {
                return { block: blocks[i], index: i, parentIndex };
            }
            if (blocks[i].innerBlocks) {
                const found = findBlockInfo(blocks[i].innerBlocks, searchId, i);
                if (found) return found;
            }
        }
        return null;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id);
        const blockInfo = findBlockInfo(formBlocks, active.id);
        setActiveBlock(blockInfo?.block);

        if (blockInfo?.block?.name === 'group') {
            setCollapsedGroups(prev => ({
                ...prev,
                [active.id]: true
            }));
        }
    };

    const handleMainDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over) return;

        const sourceInfo = findBlockInfo(formBlocks, active.id);
        const destInfo = findBlockInfo(formBlocks, over.id);

        if (!sourceInfo || !destInfo) return;

        // If source and destination are the same, do nothing
        if (active.id === over.id) {
            setActiveId(null);
            setActiveBlock(null);
            return;
        }

        // Prevent nesting groups inside groups
        if (sourceInfo.block.name === 'group' && destInfo.parentIndex !== undefined) {
            setActiveId(null);
            setActiveBlock(null);
            return;
        }

        let targetIndex = destInfo.index;
        let targetParentIndex = destInfo.parentIndex;

        // Handle dropping into or out of groups
        if (destInfo.block.name === 'group' && !collapsedGroups[destInfo.block.id]) {
            // Dropping into an expanded group
            targetParentIndex = destInfo.index;
            targetIndex = 0; // Add to the beginning of the group
        } else if (destInfo.parentIndex !== undefined && sourceInfo.parentIndex !== destInfo.parentIndex) {
            // When moving between different levels (into/out of groups)
            targetIndex = destInfo.index + 1;
        } else {
            // Same level reordering
            if (sourceInfo.index < targetIndex) {
                targetIndex -= 1;
            }
        }

        __experimentalReorderBlocks(
            sourceInfo.index,
            targetIndex,
            sourceInfo.parentIndex,
            targetParentIndex
        );

        setActiveId(null);
        setActiveBlock(null);
    };

    const handleThankYouDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!active || !over) return;

        const sourceInfo = findBlockInfo(formBlocks, active.id);
        const destInfo = findBlockInfo(formBlocks, over.id);

        if (!sourceInfo || !destInfo) return;

        // If source and destination are the same, do nothing
        if (active.id === over.id) {
            setActiveId(null);
            setActiveBlock(null);
            return;
        }

        let targetIndex = destInfo.index;

        // Adjust target index based on source position
        if (sourceInfo.index < targetIndex) {
            targetIndex -= 1;
        }

        __experimentalReorderBlocks(
            sourceInfo.index,
            targetIndex
        );

        setActiveId(null);
        setActiveBlock(null);
    };


    const handleToggleCollapse = useCallback((groupId) => {
        setCollapsedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    }, []);

    const { activeBlockType, activeBlockOrder } = useSelect((select) => {
        if (!activeBlock) return {};
        return {
            activeBlockType: select('quillForms/blocks').getBlockType(activeBlock?.name),
            activeBlockOrder: select('quillForms/block-editor').getBlockOrderById(activeBlock?.id)
        };
    });

    return (
        <div className='builder-core-blocks-list__wrapper'>
            {/* Welcome Screen - Not Sortable */}
            {welcomeScreen && (
                <div className="welcome-screen-wrapper">
                    <SortableBlock
                        block={welcomeScreen}
                        index={0}
                        isCollapsed={collapsedGroups[welcomeScreen.id]}
                        onToggleCollapse={() => handleToggleCollapse(welcomeScreen.id)}
                    />
                </div>
            )}

            {/* Main Blocks - Sortable */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleMainDragEnd}
            >
                <div className="builder-core-blocks-list">
                    <SortableContext
                        items={mainBlocks.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {mainBlocks.map((block, index) => (
                            <SortableBlock
                                key={block.id}
                                block={block}
                                index={index}
                                isCollapsed={collapsedGroups[block.id]}
                                onToggleCollapse={handleToggleCollapse}
                            />
                        ))}
                    </SortableContext>

                    <DragOverlay>
                        {activeBlock && (
                            <div style={styles.draggingBlock}>
                                <div style={styles.blockContent}>
                                    <BlockIconBox
                                        icon={activeBlockType?.icon}
                                        color={activeBlockType?.color}
                                        order={activeBlockOrder}
                                    />
                                    {activeBlock?.attributes?.label && (
                                        <span style={styles.blockLabel}
                                            dangerouslySetInnerHTML={{
                                                __html: getPlainExcerpt(activeBlock.attributes.label)
                                            }}>
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </DragOverlay>
                </div>
            </DndContext>

            {/* Thank You Screens - Separate Sortable Section */}
            {thankYouScreens.length > 0 && (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleThankYouDragEnd}
                >
                    <div className="thank-you-screens-list">
                        <h3>Thank You Screens</h3>
                        <SortableContext
                            items={thankYouScreens.map(block => block.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {thankYouScreens.map((block, index) => (
                                <SortableBlock
                                    key={block.id}
                                    block={block}
                                    index={index}
                                    isCollapsed={collapsedGroups[block.id]}
                                    onToggleCollapse={handleToggleCollapse}
                                />
                            ))}
                        </SortableContext>

                        <DragOverlay>
                            {activeBlock && (
                                <div style={styles.draggingBlock}>
                                    <div style={styles.blockContent}>
                                        <BlockIconBox
                                            icon={activeBlockType?.icon}
                                            color={activeBlockType?.color}
                                            order={activeBlockOrder}
                                        />
                                        {activeBlock?.attributes?.label && (
                                            <span style={styles.blockLabel}
                                                dangerouslySetInnerHTML={{
                                                    __html: getPlainExcerpt(activeBlock.attributes.label)
                                                }}>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </DragOverlay>
                    </div>
                </DndContext>
            )}
        </div>
    );
};

export default BlocksList;

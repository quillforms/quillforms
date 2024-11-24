import React, { useEffect, useMemo, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    UniqueIdentifier,
    MeasuringStrategy,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSelect } from "@wordpress/data";

// Types
type BlockAttachment = {
    type: 'image';
    url: string;
};

type DefaultAttributes = {
    customHTML?: string;
    label?: string;
    description?: string;
    required?: boolean;
    attachment?: BlockAttachment;
    defaultValue?: any;
    attachmentMaxWidth?: string;
    placeholder?: string | boolean;
    nextBtnLabel?: string | boolean;
    classnames?: string;
    attachmentFocalPoint?: {
        x: number;
        y: number;
    };
    attachmentFancyBorderRadius?: boolean;
    attachmentBorderRadius?: string;
    themeId?: number;
    radomize?: boolean;
    layout?: 'stack' | 'float-left' | 'float-right' | 'split-left' | 'split-right';
};

interface BlockAttributes extends DefaultAttributes {
    [x: string]: unknown;
}

type FormBlock = {
    id: string;
    name: string;
    attributes?: BlockAttributes;
    innerBlocks?: FormBlock[];
};

type FormBlocks = FormBlock[];

interface FlattenedFormBlock extends FormBlock {
    parentId: UniqueIdentifier | null;
    depth: number;
    index: number;
}


const InitialBlocks = [
    {
        "id": "7pyde2orv",
        "name": "welcome-screen",
        "attributes": {
            "buttonText": "C'est parti",
            "nextBtnLabel": false,
            "classnames": "",
            "attachment": {
                "type": "image",
                "url": "https://nathalie-crespo.fr/wp-content/uploads/2024/04/pexels-flo-dahm-1065030-scaled.jpg"
            },
            "description": "Prêt.e à entamer une transformation durable, à retrouver votre énergie et dire à dieu à vos kilos superflus sans régime restrictif ? Bravo ! Vous êtes au bon endroit ! C&#39;est partit pour 30 minutes d&#39;exploration.",
            "label": "Bravo, vous avez sauté le pas ! C&#39;est la première étape de la cure &quot;Mincir sans régime&quot;cfd",
            "customHTML": "",
            "layout": "split-left",
            "attachmentFocalPoint": {
                "x": 0.54,
                "y": 0.5
            },
            "attachmentFancyBorderRadius": false,
            "attachmentBorderRadius": "0px",
            "attachmentMaxWidth": "none"
        }
    },
    {
        "id": "444ej6019",
        "name": "group",
        "attributes": {
            "nextBtnLabel": false,
            "classnames": "",
            "attachment": [],
            "description": "Votre motivation est le moteur de votre réussite. Partagez-moi vos objectifs et ce qui vous pousse à vouloir participer au programme et à avoir envie de perdre du poids.",
            "label": "MOTIVATIONS ET OBJECTIFS",
            "customHTML": "",
            "layout": "stack",
            "attachmentFocalPoint": {
                "x": 0.5,
                "y": 0.5
            },
            "attachmentFancyBorderRadius": false,
            "attachmentBorderRadius": "0px",
            "attachmentMaxWidth": "none"
        },
        "innerBlocks": [
            {
                "id": "2uctjksyu",
                "name": "long-text",
                "attributes": {
                    "minCharacters": false,
                    "setMaxCharacters": false,
                    "required": false,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "placeholder": false,
                    "defaultValue": "",
                    "description": "",
                    "label": "Quelles sont vos attentes en participant au programme &quot;Mincir sans régime&quot; ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            },
            {
                "id": "g05bopu3k",
                "name": "multiple-choice",
                "attributes": {
                    "choices": [
                        {
                            "value": "124e4567e89b",
                            "label": "Je mange pour me nourrir et prendre soin de mon corps."
                        },
                        {
                            "value": "dnf3bid30k",
                            "label": "Je suis conscient(e) de l'importance de bien manger mais j'ai du mal à maintenir une alimentation équilibrée."
                        },
                        {
                            "value": "4d65nmhec0",
                            "label": "Je fais attention à ce que je mange, privilégiant les aliments sains."
                        },
                        {
                            "value": "l8yd4yoqrw",
                            "label": "Je me préoccupe souvent de mon poids et adopte des comportements restrictifs."
                        },
                        {
                            "value": "su4nilxllh",
                            "label": "La nourriture est source de plaisir mais je ressens parfois de la culpabilité."
                        },
                        {
                            "value": "rx40iswrqx",
                            "label": " je mange  souvent de trop ou mal pour gérer le stress."
                        }
                    ],
                    "max": false,
                    "min": false,
                    "verticalAlign": true,
                    "multiple": true,
                    "required": true,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "description": "",
                    "randomize": false,
                    "label": "Comment décririez-vous votre rapport actuel à la nourriture ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            },
            {
                "id": "1fztx9isq",
                "name": "multiple-choice",
                "attributes": {
                    "choices": [
                        {
                            "value": "124e4567e89b",
                            "label": "Je veux améliorer ma santé"
                        },
                        {
                            "value": "f4guofwj7v",
                            "label": "Je veux me sentir mieux dans mon corps dans ma tête"
                        },
                        {
                            "value": "16tgvdrken",
                            "label": "Je veux pouvoir m habiller plus facilement"
                        },
                        {
                            "value": "rtn59cm4bu",
                            "label": "Je veux plus confiance en moi"
                        },
                        {
                            "value": "afnxfbo6gk",
                            "label": "Je veux passer à autre chose"
                        },
                        {
                            "value": "nrgwht0xnb",
                            "label": "je veux en finir avec mon obsession du poids"
                        }
                    ],
                    "max": false,
                    "min": false,
                    "verticalAlign": true,
                    "multiple": true,
                    "required": true,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "description": "",
                    "randomize": false,
                    "label": "Quelles sont vos motivations pour vouloivr perdre du poids ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            },
            {
                "id": "dqtbsrqup",
                "name": "short-text",
                "attributes": {
                    "minCharacters": false,
                    "setMaxCharacters": false,
                    "required": false,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "placeholder": false,
                    "defaultValue": "",
                    "description": "",
                    "label": "Quel poids souhaitez vous faire à la fin de votre programme  ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            }
        ]
    },
    {
        "id": "vytjzrk5b",
        "name": "group",
        "attributes": {
            "nextBtnLabel": false,
            "classnames": "",
            "attachment": [],
            "description": "Votre motivation, c&#39;est le moteur de votre réussite. Partagez-moi vos objectifs et ce qui vous pousse à vouloir participer au programme.",
            "label": "VOTRE ALIMENTATION AU QUOTIDIENl",
            "customHTML": "",
            "layout": "stack",
            "attachmentFocalPoint": {
                "x": 0.5,
                "y": 0.5
            },
            "attachmentFancyBorderRadius": false,
            "attachmentBorderRadius": "0px",
            "attachmentMaxWidth": "none"
        },
        "innerBlocks": [
            {
                "id": "b7uv6lgog",
                "name": "multiple-choice",
                "attributes": {
                    "choices": [
                        {
                            "value": "rgfqa8qgac",
                            "label": "Je néglige mon alimentation en raison d'une routine établie ou manque de temps"
                        },
                        {
                            "value": "voifejz4s1",
                            "label": "Je fais attention à mon alimentation en choisissant des aliments sains."
                        },
                        {
                            "value": "83q31kvzey",
                            "label": "Je suis obsédé(e) par mon alimentation"
                        },
                        {
                            "value": "70anyxz5qc",
                            "label": "J aime me faire plaisir je suis gourmande"
                        },
                        {
                            "value": "5nq50msbe3",
                            "label": "J'ai conscience que je fait trop d'abus , et je culpabilise à  chaque fois"
                        }
                    ],
                    "max": false,
                    "min": false,
                    "verticalAlign": true,
                    "multiple": true,
                    "required": true,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "description": "",
                    "randomize": false,
                    "label": "À quel point êtes-vous conscient(e) de ce que vous mangez et de vos habitudes alimentaires ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            },
            {
                "id": "rliu8jqwj",
                "name": "short-text",
                "attributes": {
                    "minCharacters": false,
                    "setMaxCharacters": false,
                    "required": false,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "placeholder": false,
                    "attachment": [],
                    "defaultValue": "",
                    "description": "",
                    "label": "What&#39;s your name",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            },
            {
                "id": "uhyhik435",
                "name": "long-text",
                "attributes": {
                    "minCharacters": false,
                    "setMaxCharacters": false,
                    "required": false,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "placeholder": false,
                    "defaultValue": "",
                    "description": "",
                    "label": "Avez-vous des fringales dans la journée ? Si oui, quand et que mangez vous ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            },
            {
                "id": "vuyqky90x",
                "name": "long-text",
                "attributes": {
                    "minCharacters": false,
                    "setMaxCharacters": false,
                    "required": false,
                    "nextBtnLabel": false,
                    "classnames": "",
                    "placeholder": false,
                    "defaultValue": "",
                    "description": "",
                    "label": "Est ce que vous aimez cuisiner ou est- ce une charge pour vous ?",
                    "customHTML": "",
                    "layout": "stack",
                    "attachmentFocalPoint": {
                        "x": 0.5,
                        "y": 0.5
                    },
                    "attachmentFancyBorderRadius": false,
                    "attachmentBorderRadius": "0px",
                    "attachmentMaxWidth": "none"
                }
            }
        ]
    },
    {
        "id": "evona89um",
        "name": "email",
        "attributes": {
            "required": false,
            "nextBtnLabel": false,
            "classnames": "",
            "placeholder": false,
            "attachment": [],
            "defaultValue": "",
            "description": "",
            "label": "What&#39;s your email address",
            "customHTML": "",
            "layout": "stack",
            "attachmentFocalPoint": {
                "x": 0.5,
                "y": 0.5
            },
            "attachmentFancyBorderRadius": false,
            "attachmentBorderRadius": "0px",
            "attachmentMaxWidth": "none"
        }
    },
    {
        "id": "0shndjuag",
        "name": "long-text",
        "attributes": {
            "minCharacters": false,
            "setMaxCharacters": false,
            "required": false,
            "nextBtnLabel": false,
            "classnames": "",
            "placeholder": false,
            "attachment": [],
            "defaultValue": "",
            "description": "",
            "label": "Write about yourself",
            "customHTML": "",
            "layout": "stack",
            "attachmentFocalPoint": {
                "x": 0.5,
                "y": 0.5
            },
            "attachmentFancyBorderRadius": false,
            "attachmentBorderRadius": "0px",
            "attachmentMaxWidth": "none"
        }
    }
];

export const ChevronRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
);

// icons/ExpandMoreIcon.tsx
export const ExpandMoreIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
);

// icons/DragHandleIcon.tsx
export const DragHandleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
    </svg>
);

// icons/DeleteIcon.tsx
export const DeleteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
);
interface SortableTreeItemProps {
    id: string;
    depth: number;
    block: FlattenedFormBlock;
    indentationWidth?: number;
    isOver?: boolean;
    onCollapse?: () => void;
    onRemove?: () => void;
    clone?: boolean;
}

export const SortableTreeItem = ({
    id,
    depth,
    block,
    indentationWidth = 50,
    isOver,
    onCollapse,
    onRemove,
    clone,
}: SortableTreeItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        paddingLeft: `${depth * indentationWidth}px`,
    };

    const hasChildren = block.innerBlocks && block.innerBlocks.length > 0;

    const contentClassName = [
        'tree-item__content',
        isOver && 'tree-item__content--over',
        clone && 'tree-item__content--clone'
    ].filter(Boolean).join(' ');

    return (
        <div className="tree-item" ref={setNodeRef} style={style}>
            <div className={contentClassName}>
                <div className="tree-item__left-section">
                    {hasChildren ? (
                        <div className="tree-item__collapse-button">
                            <button
                                className="icon-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCollapse?.();
                                }}
                            >
                                {block.collapsed ? (
                                    <ChevronRightIcon fontSize="small" />
                                ) : (
                                    <ExpandMoreIcon fontSize="small" />
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="tree-item__spacer" />
                    )}

                    <div className="tree-item__drag-handle" {...attributes} {...listeners}>
                        <DragHandleIcon />
                        <span className="tree-item__name">{block.name}</span>
                    </div>
                </div>

                <div className="tree-item__actions">
                    {onRemove && (
                        <button
                            className="icon-button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove();
                            }}
                        >
                            <DeleteIcon fontSize="small" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// 
interface SortableTreeProps {
    initialBlocks: FormBlock[];
    indentationWidth?: number;
    collapsible?: boolean;
    removable?: boolean;
    onChange?: (blocks: FormBlock[]) => void;
}

export const SortableTree = ({
    initialBlocks = InitialBlocks,
    indentationWidth = 50,
    collapsible = true,
    removable = true,
    onChange
}: SortableTreeProps) => {
    const [blocks, setBlocks] = useState<FormBlock[]>(initialBlocks);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [overId, setOverId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const flattenBlocks = useCallback((blocks: FormBlock[], parentId?: string, depth = 0): FlattenedFormBlock[] => {
        return blocks.flatMap((block, index) => {
            const flatBlock: FlattenedFormBlock = {
                ...block,
                parentId,
                depth,
                index
            };

            if (block.innerBlocks?.length && !block.collapsed) {
                return [
                    flatBlock,
                    ...flattenBlocks(block.innerBlocks, block.id, depth + 1)
                ];
            }

            return [flatBlock];
        });
    }, []);

    const flattenedBlocks = flattenBlocks(blocks);
    // Helper functions
    const findBlock = (blocks: FormBlock[], id: string): FormBlock | null => {
        for (const block of blocks) {
            if (block.id === id) return block;
            if (block.innerBlocks?.length) {
                const found = findBlock(block.innerBlocks, id);
                if (found) return found;
            }
        }
        return null;
    };

    const removeBlock = (blocks: FormBlock[], id: string): FormBlock[] => {
        return blocks.reduce<FormBlock[]>((acc, block) => {
            if (block.id === id) return acc;

            if (block.innerBlocks?.length) {
                return [...acc, {
                    ...block,
                    innerBlocks: removeBlock(block.innerBlocks, id)
                }];
            }

            return [...acc, block];
        }, []);
    };

    const updateBlockInnerBlocks = (
        blocks: FormBlock[],
        blockId: string,
        updateFn: (innerBlocks: FormBlock[]) => FormBlock[]
    ): FormBlock[] => {
        return blocks.map(block => {
            if (block.id === blockId) {
                return {
                    ...block,
                    innerBlocks: updateFn(block.innerBlocks || [])
                };
            }
            if (block.innerBlocks?.length) {
                return {
                    ...block,
                    innerBlocks: updateBlockInnerBlocks(block.innerBlocks, blockId, updateFn)
                };
            }
            return block;
        });
    };

    const handleCollapse = (id: string) => {
        setBlocks(prevBlocks => {
            const toggleCollapse = (blocks: FormBlock[]): FormBlock[] => {
                return blocks.map(block => {
                    if (block.id === id) {
                        return { ...block, collapsed: !block.collapsed };
                    }
                    if (block.innerBlocks?.length) {
                        return {
                            ...block,
                            innerBlocks: toggleCollapse(block.innerBlocks)
                        };
                    }
                    return block;
                });
            };
            return toggleCollapse(prevBlocks);
        });
    };
    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id as string);

        if (collapsible) {
            setBlocks(prevBlocks => {
                const collapseBlock = (blocks: FormBlock[]): FormBlock[] => {
                    return blocks.map(block => {
                        if (block.id === active.id && block.innerBlocks?.length) {
                            return { ...block, collapsed: true };
                        }
                        if (block.innerBlocks?.length) {
                            return {
                                ...block,
                                innerBlocks: collapseBlock(block.innerBlocks)
                            };
                        }
                        return block;
                    });
                };
                return collapseBlock(prevBlocks);
            });
        }
    };

    const [dragIndicator, setDragIndicator] = useState<DragIndicator>({
        targetId: null,
        position: 'before'
    });

    // Add these CSS styles to your component
    const dragLineStyles = `
        .drag-indicator {
            position: absolute;
            left: 0;
            right: 0;
            height: 2px;
            background-color: #0073aa;
            pointer-events: none;
            z-index: 100;
        }

        .drag-indicator::before {
            content: '';
            position: absolute;
            left: 0;
            width: 6px;
            height: 6px;
            background-color: #0073aa;
            border-radius: 50%;
            transform: translateY(-2px);
        }

        .drag-indicator.inside {
            height: 100%;
            background-color: transparent;
            border: 2px dashed #0073aa;
        }
    `;

    const handleDragOver = ({ active, over, delta }: DragOverEvent) => {
        if (!over) {
            setDragIndicator({ targetId: null, position: 'before' });
            return;
        }

        const activeBlock = flattenedBlocks.find(b => b.id === active.id);
        const overBlock = flattenedBlocks.find(b => b.id === over.id);

        if (!activeBlock || !overBlock) return;

        const overRect = over.rect;
        const mouseRelativeY = delta.y + (overRect.height / 2);
        const middlePoint = overRect.height / 2;

        // Determine if the target block can accept inner blocks
        const canAcceptInnerBlocks = overBlock.innerBlocks !== undefined;

        let position: 'before' | 'after' | 'inside' = 'before';

        // Check if the target block is the last block in the root level
        const isLastRootBlock = !overBlock.parentId &&
            blocks[blocks.length - 1].id === over.id;

        // Find if this is the last block in a group
        const parentBlock = overBlock.parentId ? findBlock(blocks, overBlock.parentId) : null;
        const isLastInGroup = parentBlock?.innerBlocks?.indexOf(overBlock) === parentBlock?.innerBlocks?.length - 1;

        // For group interactions
        const LEFT_THRESHOLD = 20;  // Left 20px for inner group operations
        const isNearLeft = delta.x < LEFT_THRESHOLD;

        if (isLastRootBlock && mouseRelativeY > middlePoint) {
            // Don't allow dragging below last root block
            position = 'before';
            setDragIndicator({ targetId: null, position: 'before' });
            return;
        }

        if (isLastInGroup) {
            const RIGHT_THRESHOLD = overRect.width - 20;  // Last 20px for moving out
            const isNearRight = delta.x > RIGHT_THRESHOLD;
            const isNearBottom = mouseRelativeY > (overRect.height * 0.8);

            if (isNearRight && isNearBottom) {
                // Only move outside group when explicitly in bottom-right corner
                position = 'after';
            } else {
                // Normal positioning within group
                position = mouseRelativeY > middlePoint ? 'after' : 'before';
            }
        } else if (canAcceptInnerBlocks &&
            isNearLeft &&
            mouseRelativeY > overRect.height * 0.2 &&
            mouseRelativeY < overRect.height * 0.8) {
            position = 'inside';
        } else {
            position = mouseRelativeY > middlePoint ? 'after' : 'before';
        }

        // Don't allow dropping a parent into its own child
        if (isDescendant(blocks, active.id as string, over.id as string)) {
            position = 'before';
        }

        setDragIndicator({
            targetId: over.id as string,
            position
        });
    };
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over) {
            setActiveId(null);
            setOverId(null);
            setDragIndicator({ targetId: null, position: 'before' });
            return;
        }

        const newBlocks = structuredClone(blocks);
        const activeBlock = findBlock(blocks, active.id as string);
        const overBlock = flattenedBlocks.find(b => b.id === over.id);

        if (!activeBlock || !overBlock) return;

        // Remove the block from its current position
        let updatedBlocks = removeBlock(newBlocks, active.id as string);

        // Find if we're dealing with root level blocks
        const isOverBlockRoot = !overBlock.parentId;
        const overParentBlock = overBlock.parentId ? findBlock(updatedBlocks, overBlock.parentId) : null;
        console.log(dragIndicator);
        // Handle insertion based on whether we're at root level or not
        if (dragIndicator.position === 'inside' && overBlock.innerBlocks !== undefined) {
            console.log('Inserting inside');
            // Insert inside a group
            updatedBlocks = updateBlockInnerBlocks(
                updatedBlocks,
                over.id as string,
                (innerBlocks) => [...innerBlocks, activeBlock]
            );
        } else if (isOverBlockRoot) {
            console.log('Inserting at root level');
            // Insert at root level
            const rootIndex = updatedBlocks.findIndex(b => b.id === over.id);
            const insertIndex = dragIndicator.position === 'after' ? rootIndex + 1 : rootIndex;
            updatedBlocks.splice(insertIndex, 0, activeBlock);
        } else if (overParentBlock?.innerBlocks) {
            console.log('Inserting inside parent group');
            // Insert within a group's innerBlocks
            const siblingIndex = overParentBlock.innerBlocks.findIndex(b => b.id === over.id);
            const insertIndex = dragIndicator.position === 'after' ? siblingIndex + 1 : siblingIndex;

            if (dragIndicator.position === 'after' && siblingIndex === overParentBlock.innerBlocks.length - 1) {
                // If dropping after the last item of a group, insert at root level after the parent group
                const parentIndex = updatedBlocks.findIndex(b => b.id === overParentBlock.id);
                updatedBlocks.splice(parentIndex + 1, 0, activeBlock);
            } else {
                // Insert within the group
                updatedBlocks = updateBlockInnerBlocks(
                    updatedBlocks,
                    overBlock.parentId,
                    (innerBlocks) => {
                        innerBlocks.splice(insertIndex, 0, activeBlock);
                        return innerBlocks;
                    }
                );
            }
        }

        setActiveId(null);
        setOverId(null);
        setDragIndicator({ targetId: null, position: 'before' });
        setBlocks(updatedBlocks);
        onChange?.(updatedBlocks);
    };
    return (
        <div className="builder-core-blocks-list__wrapper">
            <style>{dragLineStyles}</style>
            <div className='builder-core-blocks-list'>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={flattenedBlocks.map(block => block.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {flattenedBlocks.map((block) => (
                            <div key={block.id} style={{ position: 'relative' }}>
                                {dragIndicator.targetId === block.id && (
                                    <div
                                        className={`drag-indicator ${dragIndicator.position}`}
                                        style={{
                                            top: dragIndicator.position === 'before' ? 0 : 'auto',
                                            bottom: dragIndicator.position === 'after' ? 0 : 'auto',
                                            left: `${block.depth * indentationWidth}px`
                                        }}
                                    />
                                )}
                                <SortableTreeItem
                                    id={block.id}
                                    depth={block.depth}
                                    block={block}
                                    indentationWidth={indentationWidth}
                                    isOver={overId === block.id}
                                    onCollapse={
                                        collapsible && block.innerBlocks?.length
                                            ? () => handleCollapse(block.id)
                                            : undefined
                                    }
                                    onRemove={
                                        removable
                                            ? () => setBlocks(removeBlock(blocks, block.id))
                                            : undefined
                                    }
                                />
                            </div>
                        ))}
                    </SortableContext>

                    {createPortal(
                        <DragOverlay>
                            {activeId && (
                                <SortableTreeItem
                                    id={activeId}
                                    depth={flattenedBlocks.find(block => block.id === activeId)?.depth || 0}
                                    block={flattenedBlocks.find(block => block.id === activeId)!}
                                    clone
                                />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
                </DndContext>
            </div>
        </div>
    );
};

// Helper functions
function isDescendant(blocks: FormBlocks, ancestorId: string, descendantId: string): boolean {
    for (const block of blocks) {
        if (block.id === ancestorId) {
            if (block.innerBlocks) {
                if (block.innerBlocks.some(child => child.id === descendantId)) {
                    return true;
                }
                return block.innerBlocks.some(child => isDescendant(block.innerBlocks!, ancestorId, descendantId));
            }
        } else if (block.innerBlocks) {
            if (isDescendant(block.innerBlocks, ancestorId, descendantId)) {
                return true;
            }
        }
    }
    return false;
}

function moveBlock(blocks: FormBlocks, activeId: string, overId: string, parentId?: string): FormBlocks {
    let newBlocks = JSON.parse(JSON.stringify(blocks));

    // Remove the active block from its current position
    const activeBlock = findBlockById(newBlocks, activeId);
    newBlocks = removeBlockById(newBlocks, activeId);

    // Find the target parent block
    const targetParentBlocks = parentId
        ? findBlockById(newBlocks, parentId)?.innerBlocks
        : newBlocks;

    if (!targetParentBlocks) return newBlocks;

    // Find the position to insert the active block
    const overIndex = targetParentBlocks.findIndex(block => block.id === overId);

    // Insert the active block at the new position
    targetParentBlocks.splice(overIndex, 0, activeBlock);

    return newBlocks;
}

function flattenBlocks(
    blocks: FormBlocks,
    parentId?: string,
    depth = 0,
    result: FlattenedFormBlock[] = []
): FlattenedFormBlock[] {
    blocks.forEach((block, index) => {
        const flatBlock: FlattenedFormBlock = {
            ...block,
            parentId,
            depth,
            index
        };

        result.push(flatBlock);

        if (block.innerBlocks && !block.collapsed) {
            flattenBlocks(block.innerBlocks, block.id, depth + 1, result);
        }
    });

    return result;
}




function findBlockById(blocks: FormBlocks, id: UniqueIdentifier): FormBlock | null {
    for (const block of blocks) {
        if (block.id === id) return block;
        if (block.innerBlocks) {
            const found = findBlockById(block.innerBlocks, id);
            if (found) return found;
        }
    }
    return null;
}

function removeBlockById(blocks: FormBlocks, id: UniqueIdentifier): FormBlocks {
    return blocks.reduce<FormBlocks>((acc, block) => {
        if (block.id === id) return acc;
        return [
            ...acc,
            {
                ...block,
                innerBlocks: block.innerBlocks
                    ? removeBlockById(block.innerBlocks, id)
                    : undefined,
            },
        ];
    }, []);
}
export default SortableTree;
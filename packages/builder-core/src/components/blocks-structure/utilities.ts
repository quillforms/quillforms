import type { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { FlattenedItem, TreeItem, TreeItems } from './types';

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

function getDragDepth(offset: number, indentationWidth: number) {
    return Math.round(offset / indentationWidth);
}

export function getProjection(
    items,
    activeId,
    overId,
    offset,
    indentationWidth
) {
    const activeItemIndex = items.findIndex(({ id }) => id === activeId);
    const overItemIndex = items.findIndex(({ id }) => id === overId);

    if (activeItemIndex === -1 || overItemIndex === -1) {
        return { depth: 0, maxDepth: 0, minDepth: 0, parentId: null };
    }

    const activeItem = items[activeItemIndex];
    const overItem = items[overItemIndex];

    const activeDepth = activeItem.depth;
    const overDepth = overItem.depth;

    // Handle dragging to the first position in the group
    if (overItemIndex === 0) {
        // When over the first item, inherit its parentId and depth
        return {
            depth: overItem.depth,
            maxDepth: overItem.depth + 1,
            minDepth: overItem.depth,
            parentId: overItem.parentId, // Inherit group context
        };
    }

    // Calculate the new depth based on drag offset
    let depth = Math.max(
        0,
        Math.min(
            activeDepth + Math.round(offset / indentationWidth),
            overDepth
        )
    );

    // Ensure the depth stays within the allowed range
    const maxDepth = overItem.parentId ? activeDepth + 1 : 0;
    const minDepth = overItem.parentId ? activeDepth : 0;
    depth = Math.max(minDepth, Math.min(depth, maxDepth));

    // Maintain parentId context
    const parentId =
        depth > 0
            ? overItem.parentId // Keep the same parentId if depth > 0
            : null; // Set to null if depth is 0 (root level)

    return { depth, maxDepth, minDepth, parentId };
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
    if (previousItem) {
        return previousItem.depth + 1;
    }

    return 0;
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
    if (nextItem) {
        return nextItem.depth;
    }

    return 0;
}

function flatten(
    items: TreeItems,
    parentId: UniqueIdentifier | null = null,
    depth = 0
): FlattenedItem[] {
    return items.reduce<FlattenedItem[]>((acc, item, index) => {
        return [
            ...acc,
            { ...item, parentId, depth, index },
            ...flatten(item.children, item.id, depth + 1),
        ];
    }, []);
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
    return flatten(items);
}

export function buildTree(flattenedItems) {
    const root = [];
    const itemsById = {};

    // Create a dictionary of items by id
    flattenedItems.forEach((item) => {
        itemsById[item.id] = { ...item, children: [] };
    });

    // Build the tree structure
    flattenedItems.forEach((item) => {
        if (item.parentId === null) {
            root.push(itemsById[item.id]);
        } else {
            itemsById[item.parentId]?.children.push(itemsById[item.id]);
        }
    });

    return root;
}


export function findItem(items: TreeItem[], itemId: UniqueIdentifier) {
    return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
    items: TreeItems,
    itemId: UniqueIdentifier
): TreeItem | undefined {
    for (const item of items) {
        const { id, children } = item;

        if (id === itemId) {
            return item;
        }

        if (children.length) {
            const child = findItemDeep(children, itemId);

            if (child) {
                return child;
            }
        }
    }

    return undefined;
}

export function removeItem(items: TreeItems, id: UniqueIdentifier) {
    const newItems = [];

    for (const item of items) {
        if (item.id === id) {
            continue;
        }

        if (item.children.length) {
            item.children = removeItem(item.children, id);
        }

        newItems.push(item);
    }

    return newItems;
}

export function setProperty<T extends keyof TreeItem>(
    items: TreeItems,
    id: UniqueIdentifier,
    property: T,
    setter: (value: TreeItem[T]) => TreeItem[T]
) {
    for (const item of items) {
        if (item.id === id) {
            item[property] = setter(item[property]);
            continue;
        }

        if (item.children.length) {
            item.children = setProperty(item.children, id, property, setter);
        }
    }

    return [...items];
}

function countChildren(items: TreeItem[], count = 0): number {
    return items.reduce((acc, { children }) => {
        if (children.length) {
            return countChildren(children, acc + 1);
        }

        return acc + 1;
    }, count);
}

export function getChildCount(items: TreeItems, id: UniqueIdentifier) {
    const item = findItemDeep(items, id);

    return item ? countChildren(item.children) : 0;
}

export function removeChildrenOf(
    items: FlattenedItem[],
    ids: UniqueIdentifier[]
) {
    const excludeParentIds = [...ids];

    return items.filter((item) => {
        if (item.parentId && excludeParentIds.includes(item.parentId)) {
            if (item.children.length) {
                excludeParentIds.push(item.id);
            }
            return false;
        }

        return true;
    });
}
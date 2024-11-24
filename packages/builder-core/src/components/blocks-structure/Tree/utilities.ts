import type { UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import type { FlattenedItem, FormBlock, FormBlocks } from './types';

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items: FlattenedItem[],
  activeId: UniqueIdentifier,
  overId: UniqueIdentifier | null,
  offset: number,
  indentationWidth: number
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

  let depth = Math.max(
    0,
    Math.min(
      activeDepth + Math.round(offset / indentationWidth),
      overDepth
    )
  );

  // Handle edge case for first position
  if (overItemIndex === 0) {
    depth = overItem.depth;
    return {
      depth,
      maxDepth: overItem.depth + 1,
      minDepth: overItem.depth,
      parentId: overItem.parentId,
    };
  }

  // Ensure depth doesn't exceed maxDepth or go below minDepth
  const maxDepth = overItem.parentId ? activeDepth + 1 : 0;
  const minDepth = overItem.parentId ? activeDepth : 0;
  depth = Math.max(minDepth, Math.min(depth, maxDepth));

  // Maintain parentId within the same group
  const parentId = depth > 0 ? overItem.parentId : null;

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
  items: FormBlocks,
  parentId: UniqueIdentifier | null = null,
  depth = 0
): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    const flattenedItem: FlattenedItem = {
      ...item,
      parentId,
      depth,
      index,
      innerBlocks: undefined, // This will not be used at the flattened level
    };

    return [
      ...acc,
      flattenedItem,
      ...(item.innerBlocks
        ? flatten(item.innerBlocks, item.id, depth + 1)
        : []),
    ];
  }, []);
}

export function flattenTree(items: FormBlocks): FlattenedItem[] {
  return flatten(items);
}

export function buildTree(flattenedItems: FlattenedItem[]): FormBlocks {
  const root: FormBlock[] = [];
  const nodes: Record<string, FormBlock> = {};

  // Initialize nodes with empty innerBlocks
  flattenedItems.forEach((item) => {
    nodes[item.id] = { ...item, innerBlocks: [] }; // Ensure innerBlocks is always initialized
  });

  // Build the tree
  flattenedItems.forEach((item) => {
    if (item.parentId) {
      const parentNode = nodes[item.parentId];
      if (parentNode) {
        // Ensure innerBlocks exists (TypeScript assertion)
        parentNode.innerBlocks = parentNode.innerBlocks || [];
        parentNode.innerBlocks.push(nodes[item.id]);
      }
    } else {
      root.push(nodes[item.id]); // Items with no parent are added to the root
    }
  });

  return root;
}

export function findItem(items: FormBlocks, itemId: UniqueIdentifier): FormBlock | undefined {
  return items.find(({ id }) => id === itemId);
}

export function findItemDeep(
  items: FormBlocks,
  itemId: UniqueIdentifier
): FormBlock | undefined {
  for (const item of items) {
    if (item.id === itemId) {
      return item;
    }

    if (item.innerBlocks?.length) {
      const child = findItemDeep(item.innerBlocks, itemId);
      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function removeItem(items: FormBlocks, id: UniqueIdentifier): FormBlocks {
  const newItems: FormBlocks = [];

  for (const item of items) {
    if (item.id === id) {
      continue;
    }

    if (item.innerBlocks?.length) {
      item.innerBlocks = removeItem(item.innerBlocks, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function setProperty<T extends keyof FormBlock>(
  items: FormBlocks,
  id: UniqueIdentifier,
  property: T,
  setter: (value: FormBlock[T]) => FormBlock[T]
): FormBlocks {
  return items.map((item) => {
    if (item.id === id) {
      return { ...item, [property]: setter(item[property]) };
    }

    if (item.innerBlocks?.length) {
      return {
        ...item,
        innerBlocks: setProperty(item.innerBlocks, id, property, setter),
      };
    }

    return item;
  });
}

function countChildren(items: FormBlocks, count = 0): number {
  return items.reduce((acc, { innerBlocks }) => {
    if (innerBlocks?.length) {
      return countChildren(innerBlocks, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items: FormBlocks, id: UniqueIdentifier): number {
  const item = findItemDeep(items, id);

  return item ? countChildren(item.innerBlocks ?? []) : 0;
}

export function removeChildrenOf(
  items: FlattenedItem[],
  ids: UniqueIdentifier[]
): FlattenedItem[] {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      // Do not check `innerBlocks` here as FlattenedItem does not have it
      excludeParentIds.push(item.id);
      return false;
    }

    return true;
  });
}
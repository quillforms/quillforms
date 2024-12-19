import type { MutableRefObject } from 'react';
import type { UniqueIdentifier } from '@dnd-kit/core';

export interface TreeItem {
    id: UniqueIdentifier;
    innerBlocks?: TreeItem[]; // Represents nested child items
    collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends Omit<TreeItem, 'innerBlocks'> {
    innerBlocks?: FlattenedItem[]; // FlattenedItem can also have nested children
    parentId: UniqueIdentifier | null; // Tracks the parent item
    depth: number; // Tracks the depth level in the hierarchy
    index: number; // Tracks the index within the parent's children
}

export type SensorContext = MutableRefObject<{
    items: FlattenedItem[];
    offset: number;
}>;
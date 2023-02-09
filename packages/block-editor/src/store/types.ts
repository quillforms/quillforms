import type { FormBlocks, FormBlock } from '@quillforms/types';

import {
	SETUP_STORE,
	SET_BLOCK_ATTRIBUTES,
	INSERT_BLOCK,
	DELETE_BLOCK,
	SET_CURRENT_BLOCK,
	SET_CURRENT_CHILD_BLOCK,
	REORDER_BLOCKS,
} from './constants';

export type BlocksCache = {
	[ x: string ]: {};
};

/**
 * Pure state without any higher order reducer
 */
export type BlockEditorPureState = {
	blocks: FormBlocks;
	currentBlockId: string | undefined;
	currentChildBlockId: string | undefined;
};
export interface BlockEditorState extends BlockEditorPureState {
	cache?: BlocksCache;
}

export type BlockOrder = string | number | undefined;
export interface FormBlockWithOrder extends FormBlock {
	order: BlockOrder;
}

export type InitialPayload = FormBlocks;

interface setupStoreAction {
	type: typeof SETUP_STORE;
	initialPayload: InitialPayload;
}

interface setBlockAttributesAction {
	type: typeof SET_BLOCK_ATTRIBUTES;
	attributes: Record< string, unknown >;
	blockId: string;
	parentId?: string;
}

interface __experimentalReorderBlocksAction {
	type: typeof REORDER_BLOCKS;
	sourceIndex: number;
	destinationIndex: number;
	parentSourceIndex?: string;
	parentDestIndex?: string;
}

export type DraggedBlockDestination = {
	index?: number;
	droppableId?: string;
};
interface __experimentalInsertBlockAction {
	type: typeof INSERT_BLOCK;
	block: FormBlock;
	destinationIndex: number;
	parent?: string;
}

interface setCurrentBlockAction {
	type: typeof SET_CURRENT_BLOCK;
	blockId: string;
}

interface setCurrentChildBlockAction {
	type: typeof SET_CURRENT_CHILD_BLOCK;
	blockId: string;
}

interface deleteBlockAction {
	type: typeof DELETE_BLOCK;
	blockId: string;
	parentId?: string;
}

export type BlockEditorActionTypes =
	| setupStoreAction
	| setBlockAttributesAction
	| __experimentalReorderBlocksAction
	| __experimentalInsertBlockAction
	| setCurrentBlockAction
	| setCurrentChildBlockAction
	| deleteBlockAction
	| ReturnType< () => { type: 'NOOP' } >;

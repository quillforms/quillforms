import type { FormBlocks, FormBlock } from '@quillforms/types';

import {
	SETUP_STORE,
	SET_BLOCK_ATTRIBUTES,
	INSERT_BLOCK,
	DELETE_BLOCK,
	SET_CURRENT_BLOCK,
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
}

interface __experimentalReorderBlocksAction {
	type: typeof REORDER_BLOCKS;
	sourceIndex: number;
	destinationIndex: number;
}

export type DraggedBlockDestination = {
	index?: number;
	droppableId?: string;
};
interface __experimentalInsertBlockAction {
	type: typeof INSERT_BLOCK;
	block: FormBlock;
	destination: DraggedBlockDestination;
}

interface setCurrentBlockAction {
	type: typeof SET_CURRENT_BLOCK;
	blockId: string;
}

interface deleteBlockAction {
	type: typeof DELETE_BLOCK;
	blockId: string;
}

export type BlockEditorActionTypes =
	| setupStoreAction
	| setBlockAttributesAction
	| __experimentalReorderBlocksAction
	| __experimentalInsertBlockAction
	| setCurrentBlockAction
	| deleteBlockAction
	| ReturnType< () => { type: 'NOOP' } >;

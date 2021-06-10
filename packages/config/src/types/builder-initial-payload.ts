import type { FormMessages, FormBlocks, FormLogic } from '@quillforms/types';

export type BuilderInitialPayload = {
	id: string;
	title?: {
		rendered: string;
	};
	content?: {
		rendered: string;
	};
	slug?: string;
	status?: string;
	blocks?: FormBlocks;
	messages?: FormMessages;
	theme?: { id: number };
	logic?: FormLogic;
	// Any other rest field
	[ x: string ]: unknown;
};

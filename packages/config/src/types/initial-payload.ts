import type { FormMessages, FormBlocks, FormLogic } from '@quillforms/types';

export type InitialPayload = {
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
	addons?: {
		[ x: string ]: any;
	};
	// Any other rest field
	[ x: string ]: any;
};

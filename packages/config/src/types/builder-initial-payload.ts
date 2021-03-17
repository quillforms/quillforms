import type { FormMessages } from './form-messages';
import type { FormBlocks } from './form-blocks';
import type { FormLogic } from './form-logic';
import type { FormNotications } from './form-notifications';

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
	notifications?: FormNotications;
	logic?: FormLogic;
};

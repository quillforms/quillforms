import type { FormMessages } from './form-messages';
import type { FormBlocks } from './form-blocks';
import type { FormLogic } from './form-logic';
import type { FormNotications } from './form-notifications';

export type BuilderInitialPayload = {
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
	theme?: number;
	notifications?: FormNotications;
	logic?: FormLogic;
};

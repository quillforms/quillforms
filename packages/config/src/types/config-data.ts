import type { InitialPayload } from './initial-payload';
import type { License } from './license';
import { MessagesStructure, ThemeStructure } from '@quillforms/types';
import { StoreAddons } from './store-addons';

export type ConfigData = Record< string, unknown > & {
	isWPEnv: boolean;
	maxUploadSize: number;
	structures: {
		theme: ThemeStructure;
		messages: MessagesStructure;
	};
	initialPayload: InitialPayload;
	fonts: Record< string, string >;
	license: License;
	storeAddons: StoreAddons;
};

import type { InitialPayload } from './initial-payload';
import type { Plans } from './plans';
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
	pluginDirUrl: string;
	plans: Plans;
	license: License;
	storeAddons: StoreAddons;
};

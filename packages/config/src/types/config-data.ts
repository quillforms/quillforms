import type { InitialPayload } from './initial-payload';
import { MessagesStructure, ThemeStructure } from '@quillforms/types';

export type ConfigData = Record< string, unknown > & {
	isWPEnv: boolean;
	maxUploadSize: number;
	structures: {
		theme: ThemeStructure;
		messages: MessagesStructure;
	};
	initialPayload: InitialPayload;
	fonts: Record< string, string >;
	licenseKey: string;
	licenseType: string;
	licenseValid: boolean;
};

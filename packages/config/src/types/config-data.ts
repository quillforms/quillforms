import type { BuilderInitialPayload } from './builder-initial-payload';
import { MessagesStructure } from './messages-structure';
import { NotificationStructure } from './notification-structure';
import { ThemeStructure } from './theme-structure';
export type ConfigData = Record< string, unknown > & {
	isWPEnv: boolean;
	maxUploadSize: number;
	structures: {
		theme: ThemeStructure;
		messages: MessagesStructure;
		notification: NotificationStructure;
	};
	builderInitialPayload: BuilderInitialPayload;
	fonts: Record< string, string >;
};

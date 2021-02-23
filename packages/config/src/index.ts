import type  { ConfigData } from './types/config-data';
import fonts from "./json/fonts.json";
import theme from "./json/theme-properties.json";
import messages from "./json/messages.json";
import notification from "./json/notification-properties.json";
import { BuilderInitialPayload } from './types/builder-initial-payload';
import { MessagesStructure } from './types/messages-structure';
import { NotificationStructure } from './types/notification-structure';
import { ThemeStructure } from './types/theme-structure';

const configData: ConfigData = {
	builderInitialPayload: {
		blocks: [],
		messages: {},
		theme: undefined,
		notifications: [],
		slug: '',
		logic: undefined,
	},
	fonts,
	structures: {
		theme,
		messages,
		notification
	},
	maxUploadSize: 8,
	isWPEnv: false
};
/**
 * Returns configuration value for given key
 *
 * If the requested key isn't defined in the configuration
 * data then this will report the failure with either an
 * error or a console warning.
 *
 * When in the 'development' NODE_ENV it will raise an error
 * to crash execution early. However, because many modules
 * call this function in the module-global scope a failure
 * here can not only crash that module but also entire
 * application flows as well as trigger unexpected and
 * unwanted behaviors. Therefore if the NODE_ENV is not
 * 'development' we will return `undefined` and log a message
 * to the console instead of halting the execution thread.
 *
 * @param data Configurat data.
 * @throws {ReferenceError} when key not defined in the config (NODE_ENV=development only)
 * @returns A function that gets the value of property named by the key
 */
const config = ( data: ConfigData ) => < T >( key: string ): T | undefined => {
	if ( key in data ) {
		return data[ key ] as T;
	}
	return undefined;
};


/**
 * set messages structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const setMessagesStructure = (data: ConfigData) => (value : MessagesStructure) => {
	data['structures']['messages'] = value;
}

/**
 * Get theme structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const getThemeStructure = ( data: ConfigData ) => () : ThemeStructure => {
	return data.structures.theme;
}

/**
 * set theme structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const setThemeStructure = (data: ConfigData) => (value : ThemeStructure) => {
	data['structures']['theme'] = value;
}

/**
 * Get messages structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const getMessagesStructure = ( data: ConfigData ) => () : MessagesStructure => {
	return data.structures.messages;
}

/**
 * set notification structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const setFonts = ( data: ConfigData ) => (value : Record<string,string>) => {
	data.fonts = value;
}

/**
 * Get fonts
 *
 * @param data the json environment configuration to use for getting config values
 */
const getFonts = ( data: ConfigData ) => () : Record<string,string> => {
	return data.fonts;
}


/**
 * set notification structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const setNotificationStructure = (data: ConfigData) => (value : NotificationStructure) => {
	data.structures.notification = value;
}

/**
 * Get notification structure.
 *
 * @param data the json environment configuration to use for getting config values
 */
const getNotificationStructure = ( data: ConfigData ) => () : NotificationStructure => {
	return data.structures.notification;
}

/**
 * Is wp environment active.
 *
 * @param data
 */
const isWPEnv = ( data: ConfigData ) => () : boolean => {
	return data.isWPEnv;
}

/**
 * Set wp env flag.
 *
 * @param data
 */
const setWPEnv = ( data: ConfigData ) => (value : boolean ) => {
	data.isWPEnv = value;
}
/**
 * set initial builder payload
 *
 * @param data the json environment configuration to use for getting config values
 */
const setInitialBuilderPayload = (data: ConfigData) => (value : BuilderInitialPayload) => {
	data['builderInitialPayload'] = value;
}

/**
 * Get initial builder payload
 *
 * @param data the json environment configuration to use for getting config values
 */
const getInitialBuilderPayload = ( data: ConfigData ) => () : BuilderInitialPayload => {
	return data.builderInitialPayload;
}


/**
 * Get max upload size
 *
 * @param data the json environment configuration to use for getting config values
 */
const getMaxUploadSize = ( data: ConfigData ) => () : number => {
	return data.maxUploadSize;
}

/**
 * Set max upload size
 *
 * @param data the json environment configuration to use for getting config values
 */
const setMaxUploadSize = ( data: ConfigData ) => (value: number) => {
	data.maxUploadSize = value;
}

export interface ConfigApi {
	< T >( key: string ): T;
	setInitialBuilderPayload: ( value: BuilderInitialPayload ) => void;
	getInitialBuilderPayload: () => BuilderInitialPayload;
	setMessagesStructure: (value: MessagesStructure) => void;
	getMessagesStructure: () => MessagesStructure,
	getNotificationStructure: () => NotificationStructure,
	setNotificationStructure: (value: NotificationStructure) => void,
	getThemeStructure: () => ThemeStructure,
	setThemeStructure: (value: ThemeStructure) => void,
	getFonts: () => Record<string, string>,
	setFonts: (value: Record<string, string>) => void,
	isWPEnv: () => boolean,
	setWPEnv: (value: boolean) => void,
	getMaxUploadSize: () => number,
	setMaxUploadSize: (value: number) => void
}

const createConfig = ( data: ConfigData ): ConfigApi => {
	const configApi = config( data ) as ConfigApi;
	configApi.setInitialBuilderPayload = setInitialBuilderPayload( data );
	configApi.getInitialBuilderPayload = getInitialBuilderPayload(data);
	configApi.setMessagesStructure= setMessagesStructure(data);
	configApi.getMessagesStructure = getMessagesStructure(data);
	configApi.getNotificationStructure  = getNotificationStructure(data);
	configApi.setNotificationStructure = setNotificationStructure(data);
	configApi.getThemeStructure = getThemeStructure(data);
	configApi.setThemeStructure = setThemeStructure(data);
	configApi.getFonts = getFonts(data);
	configApi.setFonts = setFonts(data);
	configApi.isWPEnv = isWPEnv(data);
	configApi.setWPEnv = setWPEnv(data);
	configApi.getMaxUploadSize = getMaxUploadSize(data);
	configApi.setMaxUploadSize = setMaxUploadSize(data);
	return configApi;
};

const configApi = createConfig( configData );

export default configApi;

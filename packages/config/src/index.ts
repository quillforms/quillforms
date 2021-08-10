import type { ConfigData } from './types/config-data';
import fonts from './json/fonts.json';
import theme from './json/theme-properties.json';
import messages from './json/messages.json';
import { InitialPayload } from './types/initial-payload';
import { MessagesStructure, ThemeStructure } from '@quillforms/types';

export type { InitialPayload };
const configData: ConfigData = {
	initialPayload: {
		id: '',
		blocks: [],
		messages: {},
		theme: undefined,
		notifications: [],
		slug: '',
		title: { rendered: '' },
		logic: undefined,
	},
	fonts,
	structures: {
		theme,
		messages,
	},
	maxUploadSize: 8,
	isWPEnv: false,
	licenseKey: '',
	licenseType: '',
	licenseValid: false,
};
/**
 * Returns configuration value for given key
 *
 * If the requested key isn't defined in the configuration
 * data then this will report the failure with either an
 * error or a console warning.

 * @param data Configurat data.
 * @returns A function that gets the value of property named by the key
 */
const config = ( data: ConfigData ) => < T >( key: string ): T | undefined => {
	if ( key in data ) {
		return data[ key ] as T;
	}
	return undefined;
};

/**
 * Get theme structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const getThemeStructure = ( data: ConfigData ) => (): ThemeStructure => {
	return data.structures.theme;
};

/**
 * Get messages structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const getMessagesStructure = ( data: ConfigData ) => (): MessagesStructure => {
	return data.structures.messages;
};

/**
 * Get fonts
 *
 * @param data the json environment configuration to use for getting config values
 */
const getFonts = ( data: ConfigData ) => (): Record< string, string > => {
	return data.fonts;
};

/**
 * Is wp environment active.
 *
 * @param data
 */
const isWPEnv = ( data: ConfigData ) => (): boolean => {
	return data.isWPEnv;
};

/**
 * Set wp env flag.
 *
 * @param data
 */
const setWPEnv = ( data: ConfigData ) => ( value: boolean ) => {
	data.isWPEnv = value;
};
/**
 * set initial builder payload
 *
 * @param data the json environment configuration to use for getting config values
 */
const setInitialPayload = ( data: ConfigData ) => ( value: InitialPayload ) => {
	data[ 'initialPayload' ] = value;
};

/**
 * Get initial builder payload
 *
 * @param data the json environment configuration to use for getting config values
 */
const getInitialPayload = ( data: ConfigData ) => (): InitialPayload => {
	return data.initialPayload;
};

/**
 * Get max upload size
 *
 * @param data the json environment configuration to use for getting config values
 */
const getMaxUploadSize = ( data: ConfigData ) => (): number => {
	return data.maxUploadSize;
};

/**
 * Get license key.
 *
 * @param data the json environment configuration to use for getting config values
 * @returns {string} license key
 */
const getLicenseKey = ( data: ConfigData ) => (): string => {
	return data.licenseKey;
};

/**
 * Set license key.
 *
 * @param data the json environment configuration to use for getting config values
 */
const setLicenseKey = ( data: ConfigData ) => ( value: string ) => {
	data.licenseKey;
	value;
};

/**
 * Is valid license.
 *
 * @param data the json environment configuration to use for getting config values
 * @returns {boolean} Is license valid
 */
const isLicenseValid = ( data: ConfigData ) => (): boolean => {
	return data.licenseValid;
};

/**
 * Set is license valid flag.
 *
 * @param data the json environment configuration to use for getting config values
 */
const setIsLicenseValid = ( data: ConfigData ) => ( value: boolean ) => {
	data.licenseValid = value;
};

/**
 * Set max upload size
 *
 * @param data the json environment configuration to use for getting config values
 */
const setMaxUploadSize = ( data: ConfigData ) => ( value: number ) => {
	data.maxUploadSize = value;
};

export interface ConfigApi {
	< T >( key: string ): T;
	setInitialPayload: ( value: InitialPayload ) => void;
	getInitialPayload: () => InitialPayload;
	getMessagesStructure: () => MessagesStructure;
	getThemeStructure: () => ThemeStructure;
	getFonts: () => Record< string, string >;
	isWPEnv: () => boolean;
	setWPEnv: ( value: boolean ) => void;
	getMaxUploadSize: () => number;
	setMaxUploadSize: ( value: number ) => void;
	getLicenseKey: () => string;
	setLicenseKey: ( value: string ) => void;
	isLicenseValid: () => boolean;
	setIsLicenseValid: ( value: boolean ) => void;
}

const createConfig = ( data: ConfigData ): ConfigApi => {
	const configApi = config( data ) as ConfigApi;
	configApi.setInitialPayload = setInitialPayload( data );
	configApi.getInitialPayload = getInitialPayload( data );
	configApi.getMessagesStructure = getMessagesStructure( data );
	configApi.getThemeStructure = getThemeStructure( data );
	configApi.getFonts = getFonts( data );
	configApi.isWPEnv = isWPEnv( data );
	configApi.setWPEnv = setWPEnv( data );
	configApi.getMaxUploadSize = getMaxUploadSize( data );
	configApi.setMaxUploadSize = setMaxUploadSize( data );
	configApi.getLicenseKey = getLicenseKey( data );
	configApi.setLicenseKey = setLicenseKey( data );
	configApi.isLicenseValid = isLicenseValid( data );
	configApi.setIsLicenseValid = setIsLicenseValid( data );
	return configApi;
};

const configApi = createConfig( configData );

export default configApi;

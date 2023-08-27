/* eslint-disable jsdoc/check-line-alignment */
import type { ConfigData } from './types/config-data';
import type { Plans } from './types/plans';
import type { License } from './types/license';
import fonts from './json/fonts.json';
import theme from './json/theme-properties.json';
import messages from './json/messages.json';
import { InitialPayload } from './types/initial-payload';
import type { MessagesStructure, ThemeStructure } from '@quillforms/types';
import { StoreAddons } from './types/store-addons';
import { Currencies } from './types/currencies';

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
	adminUrl: '',
	pluginDirUrl: '',
	formId: 0,
	formUrl: '',
	maxUploadSize: 8,
	isWPEnv: false,
	plans: {},
	license: null,
	storeAddons: {},
	formTemplates: {},
	currencies: {},
};

/**
 * Returns configuration value for given key
 *
 * If the requested key isn't defined in the configuration
 * data then this will report the failure with either an
 * error or a console warning.

 * @param {ConfigData} data Configurat data.
 * @returns A function that gets the value of property named by the key
 */
const config =
	( data: ConfigData ) =>
	< T >( key: string ): T | undefined => {
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
 * Set messages structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const setMessagesStructure =
	( data: ConfigData ) => ( value: MessagesStructure ) => {
		data.structures.messages = value;
	};

/**
 * Get templates
 *
 * @param data the json environment configuration to use for getting config values
 */
const getFormTemplates = ( data: ConfigData ) => () => {
	return data.formTemplates;
};

/**
 * Set messages structure
 *
 * @param data the json environment configuration to use for getting config values
 */
const setFormTemplates =
	( data: ConfigData ) => ( value ) => {
		data.formTemplates = value;
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
	data.initialPayload = value;
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
 * Get admin url
 *
 * @param data the json environment configuration to use for getting config values
 */
const getAdminUrl = ( data: ConfigData ) => (): string => {
	return data.adminUrl;
};

/**
 * Set admin url
 *
 * @param data the json environment configuration to use for getting config values
 */
const setAdminUrl = ( data: ConfigData ) => ( value: string ) => {
	data.adminUrl = value;
};

/**
 * Get plugin dir url
 *
 * @param data the json environment configuration to use for getting config values
 */
const getPluginDirUrl = ( data: ConfigData ) => (): string => {
	return data.pluginDirUrl;
};

/**
 * Set plugin dir url
 *
 * @param data the json environment configuration to use for getting config values
 */
const setPluginDirUrl = ( data: ConfigData ) => ( value: string ) => {
	data.pluginDirUrl = value;
};

/**
 * Get form id
 *
 * @param data the json environment configuration to use for getting config values
 */
const getFormId = ( data: ConfigData ) => (): number => {
	return data.formId;
};

/**
 * Set form id
 *
 * @param data the json environment configuration to use for getting config values
 */
const setFormId = ( data: ConfigData ) => ( value: number ) => {
	data.formId = value;
};

/**
 * Get form url
 *
 * @param data the json environment configuration to use for getting config values
 */
const getFormUrl = ( data: ConfigData ) => (): string => {
	return data.formUrl;
};

/**
 * Set form url
 *
 * @param data the json environment configuration to use for getting config values
 */
const setFormUrl = ( data: ConfigData ) => ( value: string ) => {
	data.formUrl = value;
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
 * Get plans
 *
 * @param data the json environment configuration to use for getting config values
 */
const getPlans = ( data: ConfigData ) => (): Plans => {
	return data.plans;
};

/**
 * Set plans
 *
 * @param data the json environment configuration to use for getting config values
 */
const setPlans = ( data: ConfigData ) => ( value: Plans ) => {
	data.plans = value;
};

/**
 * Get license
 *
 * @param data the json environment configuration to use for getting config values
 */
const getLicense = ( data: ConfigData ) => (): License => {
	return data.license;
};

/**
 * Set license
 *
 * @param data the json environment configuration to use for getting config values
 */
const setLicense = ( data: ConfigData ) => ( value: License ) => {
	data.license = value;
};

/**
 * Is plan accessible
 *
 * @param data the json environment configuration to use for getting config values
 * @returns {boolean}
 */
const isPlanAccessible =
	( data: ConfigData ) =>
	( featurePlanKey: string ): boolean => {
		if ( data.license?.status !== 'valid' ) {
			return false;
		}

		let plansKeys = Object.keys( data.plans );
		let licensePlanIndex = plansKeys.indexOf( data.license.plan );
		let featurePlanIndex = plansKeys.indexOf( featurePlanKey );

		if ( licensePlanIndex === -1 || featurePlanIndex === -1 ) {
			return false;
		}

		return licensePlanIndex >= featurePlanIndex;
	};

/**
 * Get store addons
 *
 * @param data the json environment configuration to use for getting config values
 */
const getStoreAddons = ( data: ConfigData ) => (): StoreAddons => {
	return data.storeAddons;
};

/**
 * Set store addons
 *
 * @param data the json environment configuration to use for getting config values
 */
const setStoreAddons = ( data: ConfigData ) => ( value: StoreAddons ) => {
	data.storeAddons = value;
};

/**
 * Get currencies
 *
 * @param data the json environment configuration to use for getting config values
 */
const getCurrencies = ( data: ConfigData ) => (): Currencies => {
	return data.currencies;
};

/**
 * Set currencies
 *
 * @param data the json environment configuration to use for getting config values
 */
const setCurrencies = ( data: ConfigData ) => ( value: Currencies ) => {
	data.currencies = value;
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
	setMessagesStructure: ( value: MessagesStructure ) => void;
	getThemeStructure: () => ThemeStructure;
	getFonts: () => Record< string, string >;
	isWPEnv: () => boolean;
	setWPEnv: ( value: boolean ) => void;
	getAdminUrl: () => string;
	setAdminUrl: ( value: string ) => void;
	getPluginDirUrl: () => string;
	setPluginDirUrl: ( value: string ) => void;
	getFormId: () => number;
	setFormId: ( value: number ) => void;
	getFormUrl: () => string;
	getFormTemplates: () => Record< string, any >;
	setFormTemplates: ( value: Record< string, any > ) => void;
	setFormUrl: ( value: string ) => void;
	getMaxUploadSize: () => number;
	setMaxUploadSize: ( value: number ) => void;
	getPlans: () => Plans;
	setPlans: ( value: Plans ) => void;
	getLicense: () => License;
	setLicense: ( value: License ) => void;
	isPlanAccessible: ( featurePlanKey: string ) => boolean;
	getStoreAddons: () => StoreAddons;
	setStoreAddons: ( value: StoreAddons ) => void;
	getCurrencies: () => Currencies;
	setCurrencies: ( value: Currencies ) => void;
	isLicenseValid: () => boolean;
	setIsLicenseValid: ( value: boolean ) => void;
}

const createConfig = ( data: ConfigData ): ConfigApi => {
	const configApi = config( data ) as ConfigApi;
	configApi.setInitialPayload = setInitialPayload( data );
	configApi.getInitialPayload = getInitialPayload( data );
	configApi.getMessagesStructure = getMessagesStructure( data );
	configApi.setMessagesStructure = setMessagesStructure( data );
	configApi.getThemeStructure = getThemeStructure( data );
	configApi.getFonts = getFonts( data );
	configApi.isWPEnv = isWPEnv( data );
	configApi.setWPEnv = setWPEnv( data );
	configApi.getAdminUrl = getAdminUrl( data );
	configApi.setAdminUrl = setAdminUrl( data );
	configApi.getPluginDirUrl = getPluginDirUrl( data );
	configApi.setPluginDirUrl = setPluginDirUrl( data );
	configApi.getFormId = getFormId( data );
	configApi.setFormId = setFormId( data );
	configApi.getFormUrl = getFormUrl( data );
	configApi.setFormUrl = setFormUrl( data );
	configApi.getMaxUploadSize = getMaxUploadSize( data );
	configApi.setMaxUploadSize = setMaxUploadSize( data );
	configApi.getPlans = getPlans( data );
	configApi.setPlans = setPlans( data );
	configApi.getLicense = getLicense( data );
	configApi.setLicense = setLicense( data );
	configApi.isPlanAccessible = isPlanAccessible( data );
	configApi.getStoreAddons = getStoreAddons( data );
	configApi.setStoreAddons = setStoreAddons( data );
	configApi.getCurrencies = getCurrencies( data );
	configApi.setCurrencies = setCurrencies( data );
	configApi.setFormTemplates = setFormTemplates( data );
	configApi.getFormTemplates = getFormTemplates( data );
	return configApi;
};

const configApi = createConfig( configData );

export default configApi;

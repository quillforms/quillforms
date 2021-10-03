export type StoreAddon = {
	name: string;
	description: string;
	version: string;
	plan: string;
	is_integration: boolean;
	is_installed: boolean;
	is_active: boolean;
	assets: {
		icon: string;
	};
};

export type StoreAddons = {
	[ addonSlug: string ]: StoreAddon;
};

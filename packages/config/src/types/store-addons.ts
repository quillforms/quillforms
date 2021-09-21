export type StoreAddons = {
	[ addonSlug: string ]: {
		name: string;
		description: string;
		version: string;
		plan: string;
		is_integration: boolean;
		is_installed: boolean;
		is_active: boolean;
	};
};

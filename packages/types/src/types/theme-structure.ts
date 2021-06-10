export type ThemeStructure = Record<
	string,
	{
		default?: string;
		type: string;
		[ x: string ]: unknown;
	}
>;

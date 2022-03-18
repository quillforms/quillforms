export type ThemeStructure = Record<
	string,
	{
		default?: string | number | object;
		type: string;
		[ x: string ]: unknown;
	}
>;

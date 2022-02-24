export type ThemeStructure = Record<
	string,
	{
		default?: string | number;
		type: string;
		[ x: string ]: unknown;
	}
>;

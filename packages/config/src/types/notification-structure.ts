export type NotificationStructure = Record<
	string,
	{
		default?: unknown;
		type: string;
		[ x: string ]: unknown;
	}
>;

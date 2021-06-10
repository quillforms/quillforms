type MergeTag = {
	type: string;
	label: string;
	modifier: string;
};
export type MessagesStructure = Record<
	string,
	{
		default: string;
		title: string;
		category: string;
		mergeTags?: MergeTag[];
		allowedHTML?: string[];
	}
>;

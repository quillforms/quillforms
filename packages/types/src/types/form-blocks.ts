type BlockAttachment = {
	type: 'image';
	url: string;
};
type DefaultAttributes = {
	label?: string;
	description?: string;
	required?: boolean;
	attachment?: BlockAttachment;
	themeId?: number;
};
export interface BlockAttributes extends DefaultAttributes {
	[ x: string ]: unknown;
}

export type FormBlock = {
	id: string;
	name: string;
	attributes?: BlockAttributes;
};

export type FormBlocks = FormBlock[];

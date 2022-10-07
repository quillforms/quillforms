type BlockAttachment = {
	type: 'image';
	url: string;
};
type DefaultAttributes = {
	customHTML?: string;
	label?: string;
	description?: string;
	required?: boolean;
	attachment?: BlockAttachment;
	attachmentFocalPoint?: {
		x: number;
		y: number;
	};
	themeId?: number;
	layout?:
		| 'stack'
		| 'float-left'
		| 'float-right'
		| 'split-left'
		| 'split-right';
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

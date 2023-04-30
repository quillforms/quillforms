type BlockAttachment = {
	type: 'image';
	url: string;
};
export type DefaultAttributes = {
	customHTML?: string;
	label?: string;
	description?: string;
	required?: boolean;
	attachment?: BlockAttachment;
	attachmentMaxWidth?: string;
	placeholder?: string | boolean;
	nextBtnLabel?: string | boolean;
	classnames?: string;
	attachmentFocalPoint?: {
		x: number;
		y: number;
	};
	attachmentFancyBorderRadius?: boolean;
	attachmentBorderRadius?: string;
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
	innerBlocks?: FormBlock[];
};

export type FormBlocks = FormBlock[];

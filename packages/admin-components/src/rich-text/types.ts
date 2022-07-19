import type { IconRenderer } from '@quillforms/types';
import { Element } from 'slate';
import { BaseEditor } from 'slate';
export declare type CustomEditor = BaseEditor;
export declare type CustomElement = {
	children: CustomNode[];
	[ key: string ]: any;
};
export declare type CustomText = {
	text: string;
	[ key: string ]: any;
};
export declare type CustomNode = CustomElement | CustomText;
export declare type CustomDescendent = {
	children: CustomNode[];
};
declare module 'slate' {
	interface CustomTypes {
		Editor: CustomEditor;
		Element: CustomElement;
		Text: CustomText;
		Descendent: CustomDescendent;
	}
}

export type MergeTag = {
	type: string;
	modifier: string;
	label?: string;
	icon?: IconRenderer;
	color?: string;
};

export interface Link extends Element {
	url: string;
}

export type MergeTags = MergeTag[];

type allowedFormat = 'bold' | 'italic' | 'link';

export type allowedFormats = allowedFormat[];

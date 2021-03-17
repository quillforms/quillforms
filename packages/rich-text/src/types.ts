import type { IconRenderer } from '@quillforms/utils';
import { Element } from 'slate';
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

type FormatControl = 'bold' | 'strong' | 'link';
export type FormatControls = FormatControl[];

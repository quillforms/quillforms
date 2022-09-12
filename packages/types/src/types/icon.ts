import { Dashicon } from '@wordpress/components';
import type { ComponentType } from 'react';
export type Icon = JSX.Element | ComponentType | Dashicon.Icon;

export type IconDescriptor = {
	src: Icon;
	background?: string;
	foreground?: string;
	shadowColor?: string;
};
export type IconRenderer = IconDescriptor | Icon | undefined;

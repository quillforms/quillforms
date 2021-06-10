import { Dashicon } from '@wordpress/components';

export type Icon = JSX.Element | React.FC | Dashicon.Icon;

export type IconDescriptor = {
	src: Icon;
	background?: string;
	foreground?: string;
	shadowColor?: string;
};
export type IconRenderer = IconDescriptor | Icon | undefined;

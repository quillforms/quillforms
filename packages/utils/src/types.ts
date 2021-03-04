import { Component, FC } from 'react';

export type Icon = FC | Component | JSX.Element | string;
export type IconDescriptor = {
	src: Icon;
	background?: string;
	foreground?: string;
	shadowColor?: string;
};
export type IconRenderer = IconDescriptor | Icon | undefined;

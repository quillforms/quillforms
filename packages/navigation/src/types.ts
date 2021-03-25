import React from 'react';
export type PageSettings = {
	path: string;
	component: React.FC | JSX.Element | React.Component;
	template: 'default' | 'full-screen';
	header: React.FC | JSX.Element | React.Component;
};
export type Pages = Record< string, PageSettings >;

import React from 'react';
export type PageSettings = {
	path: string;
	exact?: boolean;
	component: React.FC | JSX.Element | React.Component;
	template: 'default' | 'full-screen';
	header: React.FC | JSX.Element | React.Component;
	requiresInitialPayload: boolean;
	connectedStores: string[];
};
export type Pages = Record< string, PageSettings >;

import React from 'react';
export type PageSettings = {
	path: string;
	exact?: boolean;
	component: React.FC | React.Component;
	template: 'default' | 'full-screen';
	header: React.FC | React.Component;
	requiresInitialPayload: boolean;
	connectedStores: string[];
};
export type Pages = Record<string, PageSettings>;

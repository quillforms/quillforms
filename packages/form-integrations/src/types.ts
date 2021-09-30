import React from 'react';
import type { IconRenderer } from '@quillforms/types';

export type IntegrationModuleSettings = {
	render: React.FC | JSX.Element | React.Component;
	connectedStores: string[];
	icon: string | IconRenderer;
	title: string;
	description: string;
	displayMode?: 'modal' | 'page';
};

export type IntegrationModules = Record< string, IntegrationModuleSettings >;

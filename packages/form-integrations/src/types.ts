import React from 'react';
import type { IconRenderer } from '@quillforms/types';

export type IntegrationModuleSettings = {
	render: React.FC< { slug: string } > | JSX.Element | React.Component;
	settingsRender:
		| React.FC< { slug: string } >
		| JSX.Element
		| React.Component;
	icon: string | IconRenderer;
	title: string;
	description: string;
};

export type IntegrationModules = Record< string, IntegrationModuleSettings >;

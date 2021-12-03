import React from 'react';
import type { IconRenderer } from '@quillforms/types';

export type PaymentGatewayModuleSettings = {
	optionsRender:
		| React.FC< {
				slug: string;
				options: any;
				onOptionsChange: ( options ) => void;
		  } >
		| JSX.Element
		| React.Component;
	settingsRender:
		| React.FC< { slug: string } >
		| JSX.Element
		| React.Component;
	icon: string | IconRenderer;
	title: string;
	description: string;
	active: boolean;
};

export type PaymentGatewayModules = Record<
	string,
	PaymentGatewayModuleSettings
>;

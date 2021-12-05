import React from 'react';
import type { IconRenderer } from '@quillforms/types';

export type PaymentGatewayModuleSettings = {
	name: string;
	icon: string | IconRenderer;
	description: string;
	active: boolean;
	settingsRender:
		| React.FC< { slug: string } > /* gateway */
		| JSX.Element
		| React.Component;
	methods: {
		[ key: string ]: {
			name: string;
			optionsRender:
				| React.FC< {
						slug: string /* gateway:method */;
						options: any;
						onOptionsChange: ( options: any ) => void;
				  } >
				| JSX.Element
				| React.Component;
			clientRender:
				| React.FC< {
						slug: string /* gateway:method */;
						options: any;
				  } >
				| JSX.Element
				| React.Component;
		};
	};
};

export type PaymentGatewayModules = Record<
	string,
	PaymentGatewayModuleSettings
>;

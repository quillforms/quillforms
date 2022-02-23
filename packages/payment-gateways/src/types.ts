import React from 'react';
import type { IconRenderer } from '@quillforms/types';

export type PaymentGatewayModule = {
	name: string;
	icon: string | IconRenderer;
	description: string;
	active: boolean;
	settings: React.FC< { slug: string } > | JSX.Element | React.Component;
	isPro?: boolean;
	options?:
		| React.FC< {
				slug: string;
				settings: any /* form settings */;
				onOptionsChange: ( options: any ) => void;
		  } >
		| JSX.Element
		| React.Component;
	methods: {
		[ key: string ]: {
			isRecurringSupported: boolean;
			isCustomerRequired?: {
				onetime?: boolean;
				recurring?: boolean;
			};
			admin: {
				label: {
					icon: string | IconRenderer;
					text: string;
				};
				options?:
					| React.FC< {
							slug: string /* gateway:method */;
							settings: any /* form settings */;
							onOptionsChange: ( options: any ) => void;
					  } >
					| JSX.Element
					| React.Component;
			};
			customer: {
				label: {
					text: string;
				};
				render:
					| React.FC< {
							slug: string /* gateway:method */;
							data: any;
							onComplete: () => void;
					  } >
					| JSX.Element
					| React.Component;
			};
		};
	};
};

export type PaymentGatewayModules = Record< string, PaymentGatewayModule >;

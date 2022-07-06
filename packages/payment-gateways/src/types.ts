import React from 'react';
import type { IconRenderer } from '@quillforms/types';

export type PaymentGatewayModule = {
	name: string;
	icon: {
		mini: string | IconRenderer;
		full: string | IconRenderer;
	};
	description: string;
	active: boolean;
	// settings component at settings->payments
	settings: React.FC< { slug: string } >;
	// gateway options at form->payments
	options?: {
		// settings: all settings at form->payments
		component: React.FC< {
			slug: string;
			settings: any;
			onChange: ( value: any ) => void;
		} >;
		has: ( settings: any ) => boolean;
		validate: ( settings: any ) => { valid: boolean; message?: string };
	};
	methods: {
		[ key: string ]: {
			configured: boolean;
			isRecurringSupported: boolean;
			admin: {
				label: {
					icon: string | IconRenderer;
					text: string;
				};
			};
			customer: {
				label: {
					text: string;
				};
				render: React.FC< {
					slug: string /* gateway:method */;
					data: any;
					onComplete: () => void;
				} >;
			};
		};
	};
};

export type PaymentGatewayModules = Record< string, PaymentGatewayModule >;

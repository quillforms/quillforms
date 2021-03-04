/**
 * External dependencies
 */
import { has, isFunction, isString } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, isValidElement } from '@wordpress/element';

/**
 * External dependencies
 */
import { default as tinycolor, mostReadable } from 'tinycolor2';
import type { IconDescriptor, IconRenderer, Icon } from './types';
export type { SelectFromMap, DispatchFromMap } from './mapped-types';
export type { IconDescriptor, IconRenderer, Icon };

const ICON_COLORS = [ '#191e23', '#f8f9f9' ];
/**
 * Function that checks if the parameter is a valid icon.
 *
 * @param {*} icon  Parameter to be checked.
 *
 * @return {boolean} True if the parameter is a valid icon and false otherwise.
 */

export function isValidIcon( icon: unknown ): boolean {
	return (
		!! icon &&
		( isString( icon ) ||
			isValidElement( icon as Record< string, unknown > | undefined ) ||
			isFunction( icon ) ||
			icon instanceof Component )
	);
}

/**
 * Function that receives an icon during the registration
 * and returns a new icon object that is normalized so we can rely on just on possible icon structure
 * in the codebase.
 *
 * @param {IconRenderer} icon Render behavior of icon;
 *                                     one of a Dashicon slug, an element, or a
 *                                     component.
 *
 * @return {IconDescriptor} Object describing the icon.
 */
export function normalizeIconObject( icon: IconRenderer ): IconDescriptor {
	if ( ! icon ) icon = 'plus';
	if ( isValidIcon( icon as Icon ) ) {
		return { src: icon } as IconDescriptor;
	}
	if ( has( icon, [ 'background' ] ) ) {
		icon = icon as IconDescriptor;
		const tinyBgColor = tinycolor( icon.background );

		return {
			...icon,
			foreground: icon.foreground
				? icon.foreground
				: mostReadable( tinyBgColor, ICON_COLORS, {
						includeFallbackColors: true,
						level: 'AA',
						size: 'large',
				  } ).toHexString(),
			shadowColor: tinyBgColor.setAlpha( 0.3 ).toRgbString(),
		};
	}

	return icon as IconDescriptor;
}

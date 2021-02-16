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

const ICON_COLORS = [ '#191e23', '#f8f9f9' ];

/**
 * Function that checks if the parameter is a valid icon.
 *
 * @param {*} icon  Parameter to be checked.
 *
 * @return {boolean} True if the parameter is a valid icon and false otherwise.
 */

export function isValidIcon( icon ) {
	return (
		!! icon &&
		( isString( icon ) ||
			isValidElement( icon ) ||
			isFunction( icon ) ||
			icon instanceof Component )
	);
}

/**
 * Function that receives an icon as set by the blocks during the registration
 * and returns a new icon object that is normalized so we can rely on just on possible icon structure
 * in the codebase.
 *
 * @param {QFBlockTypeIconRender} icon Render behavior of a block type icon;
 *                                     one of a Dashicon slug, an element, or a
 *                                     component.
 *
 * @return {QFBlockTypeIconDescriptor} Object describing the icon.
 */
export function normalizeIconObject( icon ) {
	if ( isValidIcon( icon ) ) {
		return { src: icon };
	}

	if ( has( icon, [ 'background' ] ) ) {
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

	return icon;
}

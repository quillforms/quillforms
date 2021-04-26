/**
 * External dependencies
 */
import { isFunction, isString } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, isValidElement } from '@wordpress/element';

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

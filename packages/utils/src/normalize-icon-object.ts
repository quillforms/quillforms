/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, IconRenderer, Icon } from '@quillforms/types';

/**
 * External dependencies
 */
import { default as tinycolor, mostReadable } from 'tinycolor2';
import { has } from 'lodash';

/**
 * Internal Dependencies
 */
import { isValidIcon } from './is-valid-icon';

const ICON_COLORS = [ '#191e23', '#f8f9f9' ];

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

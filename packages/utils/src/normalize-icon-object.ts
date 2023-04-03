/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, IconRenderer, Icon } from '@quillforms/types';
/**
 * Internal Dependencies
 */
import { isValidIcon } from './is-valid-icon';


/**
 * Function that receives an icon during the registration
 * and returns a new icon object that is normalized so we can rely on just on possible icon structure
 * in the codebase.
 *
 * @param {IconRenderer} icon Render behavior of icon;
 *                            one of a Dashicon slug, an element, or a
 *                            component.
 *
 * @return {IconDescriptor} Object describing the icon.
 */
export function normalizeIconObject( icon: IconRenderer ): IconDescriptor {
	if ( ! icon ) icon = 'plus';
	if ( isValidIcon( icon as Icon ) ) {
		return { src: icon } as IconDescriptor;
	}

	return icon as IconDescriptor;
}

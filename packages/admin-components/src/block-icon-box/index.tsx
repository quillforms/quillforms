/**
 * QuillForms Dependencies
 */
import type {
	IconRenderer,
	IconDescriptor,
	Icon as IconType,
} from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { Icon, Dashicon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { FC } from 'react';

/**
 * Internal Dependencies
 */
import BlockIconWrapper from './wrapper';

interface props {
	icon?: IconRenderer;
	order?: string | number | undefined;
	color?: string | undefined;
}
const BlockIconBox: FC< props > = ( { icon, order, color } ) => {
	icon = icon ? icon : plus;
	color = color ? color : '#bb426f';
	const renderedIcon = (
		<Icon
			icon={
				( ( icon as IconDescriptor )?.src as IconType )
					? ( ( icon as IconDescriptor ).src as IconType )
					: ( icon as Dashicon.Icon )
			}
		/>
	);

	return (
		<BlockIconWrapper color={ color }>
			{ renderedIcon }
			{ order && (
				<span className="admin-components-block-icon-box__order">
					{ order }
				</span>
			) }
		</BlockIconWrapper>
	);
};

export default BlockIconBox;

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
// @ts-expect-error
import { Icon, Dashicon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * External Dependencies
 */
import { FC } from 'react';
import classnames from 'classnames';

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
					// @ts-expect-error
					: ( icon as Dashicon.Icon )
			}
		/>
	);

	return (
		<BlockIconWrapper color={ color }>
			{ renderedIcon }
			{ order && (
				<span
					className={ classnames(
						'admin-components-block-icon-box__order',
						{
							'black-color': color === '#fff',
						}
					) }
				>
					{ order }
				</span>
			) }
		</BlockIconWrapper>
	);
};

export default BlockIconBox;

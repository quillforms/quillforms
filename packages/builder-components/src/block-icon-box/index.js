/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import BlockIconWrapper from './wrapper';

const BlockIconBox = ( { icon, order, color } ) => {
	icon = icon ? icon : plus;
	color = color ? color : '#bb426f';
	const renderedIcon = <Icon icon={ icon && icon.src ? icon.src : icon } />;

	return (
		<BlockIconWrapper color={ color }>
			{ renderedIcon }
			{ order && (
				<span className="block-editor-block-icon-box__order">
					{ order }
				</span>
			) }
		</BlockIconWrapper>
	);
};

export default BlockIconBox;

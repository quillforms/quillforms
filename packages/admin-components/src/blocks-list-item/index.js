import classNames from 'classnames';
import { memo } from '@wordpress/element';
import { Icon } from '@wordpress/components';
import { blockDefault, plus } from '@wordpress/icons';

const areEqual = ( prevProps, nextProps ) => {
	if ( prevProps.disabled === nextProps.disabled ) return true;
	return false;
};
const BlocksListItem = memo( ( { item, disabled } ) => {
	let icon = item?.editorConfig?.icon;
	if ( icon?.src === 'block-default' ) {
		icon = {
			src: blockDefault,
		};
	}
	if ( ! icon ) icon = plus;
	const renderedIcon = <Icon icon={ icon && icon.src ? icon.src : icon } />;

	return (
		<div
			className={ classNames( 'builder-components-blocks-list-item', {
				disabled: disabled ? true : false,
			} ) }
		>
			<span
				className="builder-components-blocks-list-item__icon-wrapper"
				style={ {
					backgroundColor: item?.editorConfig?.color
						? item.editorConfig.color
						: '#bb426f',
				} }
			>
				<span className="builder-components-blocks-list-item__icon">
					{ renderedIcon }
				</span>
			</span>
			<span className="builder-components-blocks-list-item__block-name">
				{ item.name }
			</span>
		</div>
	);
}, areEqual );

export default BlocksListItem;

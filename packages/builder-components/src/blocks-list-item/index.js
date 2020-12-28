import classNames from 'classnames';
import { memo } from '@wordpress/element';

const areEqual = ( prevProps, nextProps ) => {
	if ( prevProps.disabled === nextProps.disabled ) return true;
	return false;
};
const BlocksListItem = memo( ( { item, disabled } ) => {
	return (
		<div
			className={ classNames( 'builder-components-blocks-list-item', {
				disabled: disabled ? true : false,
			} ) }
		>
			<span
				className="builder-components-blocks-list-item__icon-wrapper"
				style={ { backgroundColor: item?.editorConfig?.color ? item.editorConfig.color : "#333"} }
			>
				<span className="builder-components-blocks-list-item__icon">
					{ item?.editorConfig?.icon && <item.editorConfig.icon /> }
				</span>
			</span>
			<span className="builder-components-blocks-list-item__block-name">
				{ item.name }
			</span>
		</div>
	);
}, areEqual );

export default BlocksListItem;

import classNames from 'classnames';
const BlocksListItem = ( { item, disabled } ) => {
	return (
		<div
			className={ classNames( 'builder-components-blocks-list-item', {
				disabled: disabled ? true : false,
			} ) }
		>
			<span
				className="builder-components-blocks-list-item__icon-wrapper"
				style={ { backgroundColor: item.editorConfig.color } }
			>
				<span className="builder-components-blocks-list-item__icon">
					<item.editorConfig.icon />
				</span>
			</span>
			<span className="builder-components-blocks-list-item__block-name">
				{ item.name }
			</span>
		</div>
	);
};

export default BlocksListItem;

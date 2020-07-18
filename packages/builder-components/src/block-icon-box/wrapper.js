const BlockIconWrapper = ( { color, children } ) => {
	return (
		<div
			className="block-editor-block-icon-box"
			style={ {
				background: color,
			} }
		>
			{ children }
		</div>
	);
};

export default BlockIconWrapper;

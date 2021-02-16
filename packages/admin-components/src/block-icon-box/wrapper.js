const BlockIconWrapper = ( { color, children } ) => {
	return (
		<div
			className="block-editor-block-icon-box"
			style={ {
				background: color ? color : '#333',
			} }
		>
			{ children }
		</div>
	);
};

export default BlockIconWrapper;

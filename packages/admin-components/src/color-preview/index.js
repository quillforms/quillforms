const ColorPickerButton = ( { color } ) => {
	return (
		<div className="admin-components-color-preview">
			<div
				className="admin-components-color-preview__square"
				style={ { background: color } }
			></div>
		</div>
	);
};

export default ColorPickerButton;

const ColorPickerButton = ( { color } ) => {
	return (
		<div className="builder-components-color-preview">
			<div
				className="builder-components-color-preview__square"
				style={ { background: color } }
			></div>
		</div>
	);
};

export default ColorPickerButton;

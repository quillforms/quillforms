const dropdownIcon = ( props ) => {
	return (
		<div { ...props } className="dropdown__icon">
			<svg height="32" width="32" viewBox="0 0 512 512">
				<polygon points="396.6,160 416,180.7 256,352 96,180.7 115.3,160 256,310.5 " />
			</svg>
		</div>
	);
};

export default dropdownIcon;

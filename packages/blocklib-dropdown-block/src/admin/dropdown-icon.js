const DropdownArrow = ({ color = "currentColor", size = 24 }) => {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill={color}
		>
			<path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
		</svg>
	);
};

export default DropdownArrow;


const CalculatorIcon = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			{/* Calculator Body */}
			<rect
				x="3"
				y="2"
				width="18"
				height="20"
				rx="3"
				ry="3"
				fill="none"
				stroke="currentColor"
			/>

			{/* Display Screen */}
			<rect
				x="5.5"
				y="4"
				width="13"
				height="5"
				rx="1"
				ry="1"
				fill="none"
				stroke="currentColor"
			/>

			{/* Buttons */}
			{/* First Row */}
			<circle cx="8" cy="13" r="1.2" fill="none" stroke="currentColor" />
			<circle cx="12" cy="13" r="1.2" fill="none" stroke="currentColor" />
			<circle cx="16" cy="13" r="1.2" fill="none" stroke="currentColor" />

			{/* Second Row */}
			<circle cx="8" cy="18" r="1.2" fill="none" stroke="currentColor" />
			<circle cx="12" cy="18" r="1.2" fill="none" stroke="currentColor" />
			<circle cx="16" cy="18" r="1.2" fill="none" stroke="currentColor" />
		</svg>
	);
};

export default CalculatorIcon;
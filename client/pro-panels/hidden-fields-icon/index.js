const HiddenIcon = () => {
	return (
		<svg viewBox="0 0 24 24" stroke="currentColor" fill="none" aria-hidden="true" focusable="false">
			{/* More refined eye curve with better control points */}
			<path
				d="M2.5 12C2.5 12 7 7 12 7C17 7 21.5 12 21.5 12C21.5 12 17 17 12 17C7 17 2.5 12 2.5 12Z"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				fill="none"
			/>

			{/* Simple iris, slightly adjusted position */}
			<circle
				cx="12"
				cy="12"
				r="2.8"
				strokeWidth="1.5"
				fill="none"
			/>

			{/* Refined diagonal line position */}
			<line
				x1="4.5"
				y1="4.5"
				x2="19.5"
				y2="19.5"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default HiddenIcon;
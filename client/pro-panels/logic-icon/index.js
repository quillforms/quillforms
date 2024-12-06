const JumpLogicIcon = () => {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
			{/* Source - emphasized start point */}
			<circle
				cx="12"
				cy="5"
				r="2.5"
				fill="currentColor"
				opacity="0.2"
			/>
			<circle
				cx="12"
				cy="5"
				r="2.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>

			{/* Destination points */}
			<circle
				cx="6"
				cy="19"
				r="2"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
			<circle
				cx="18"
				cy="19"
				r="2"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
			/>

			{/* Jump paths - with smooth arcs */}
			<path
				d="M12 7C12 7 12 14 6 17"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
			<path
				d="M12 7C12 7 12 14 18 17"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>
		</svg>
	);
};

export default JumpLogicIcon;
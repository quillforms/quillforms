const GroupBlockIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
		{/* Top Block */}
		<rect x="6" y="2" width="8" height="3" rx="1" fill="currentColor" />
		<rect x="6.2" y="2.2" width="7.6" height="2.6" rx="0.8" fill="white" />

		{/* Bottom Block */}
		<rect x="6" y="10" width="8" height="3" rx="1" fill="currentColor" />
		<rect x="6.2" y="10.2" width="7.6" height="2.6" rx="0.8" fill="white" />

		{/* Left Dots - Redesigned as Rounded Buttons */}
		<circle cx="3" cy="3.5" r="1" fill="currentColor" />
		<circle cx="3" cy="11.5" r="1" fill="currentColor" />
	</svg>
);

export default GroupBlockIcon;
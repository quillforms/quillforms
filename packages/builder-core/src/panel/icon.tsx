const DashboardIcon: React.FC = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			{/* Top left panel */}
			<path d="M3 3v10h8V3H3zm1 1h6v8H4V4z" />

			{/* Bottom left panel */}
			<path d="M3 15v6h8v-6H3zm1 1h6v4H4v-4z" />

			{/* Right panel */}
			<path d="M13 3v18h8V3h-8zm1 1h6v16h-6V4z" />
		</svg>
	);
};

// Alternative version with rounded corners
const DashboardIconRounded: React.FC = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			{/* Top left panel */}
			<path d="M3 3c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v8c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V3zm1.5 1v6h5V4h-5z" />

			{/* Bottom left panel */}
			<path d="M3 15c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v4c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1v-4zm1.5 1v2h5v-2h-5z" />

			{/* Right panel */}
			<path d="M13 3c0-.6.4-1 1-1h6c.6 0 1 .4 1 1v16c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V3zm1.5 1v14h5V4h-5z" />
		</svg>
	);
};

export default DashboardIconRounded;
const NotificationIcon = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			{/* Creative outline shape - will always show as outline */}
			<path
				d="M12 3.5c-3.3 0-5.7 2.4-5.7 5.7v3.8c0 .3-.1.6-.2.8l-1.8 2.5c-.4.6-.4 1.4.1 2 .4.5 1 .7 1.6.7h12c.6 0 1.2-.2 1.6-.7.5-.6.5-1.4.1-2l-1.8-2.5c-.1-.2-.2-.5-.2-.8V9.2c0-3.3-2.4-5.7-5.7-5.7z"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Ring effect at top */}
			<path
				d="M12 3.5V2m0 1.5c-1 0-2 .2-2.8.6"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>

			{/* Bottom piece with style */}
			<path
				d="M8.5 18.2c.2 1.6 1.6 2.8 3.5 2.8s3.3-1.2 3.5-2.8"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
			/>

			{/* Decorative sound waves */}
			<path
				d="M19 10c.5-.5 1-1.5 1-2.5M5 10c-.5-.5-1-1.5-1-2.5"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				opacity="0.6"
			/>
		</svg>
	);
};

export default NotificationIcon;
/**
 * External dependencies
 */
import { css } from 'emotion';

const CheckboxControl = ({ checkboxStatus, clicked }) => {
	const isChecked = checkboxStatus === 'checked';
	const isMixed = checkboxStatus === 'mixed';
	const isActive = isChecked || isMixed;

	return (
		<div
			onClick={(e) => {
				e.stopPropagation();
				clicked();
			}}
			className={css`
				width: 20px;
				height: 20px;
				min-width: 20px;
				border-radius: 5px;
				border: 1.5px solid ${isActive ? '#B2328C' : '#D1D5DB'};
				background: ${isActive ? '#B2328C' : '#ffffff'};
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				transition: background 0.15s ease, border-color 0.15s ease;
				margin-right: 10px;
				flex-shrink: 0;
			`}
		>
			{isActive && (
				<svg
					viewBox="0 0 24 24"
					width="13"
					height="13"
					fill="none"
					stroke="#ffffff"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					{isMixed ? (
						<line x1="5" y1="12" x2="19" y2="12" />
					) : (
						<polyline points="20 6 9 17 4 12" />
					)}
				</svg>
			)}
		</div>
	);
};

export default CheckboxControl;

import { css } from "emotion";
const BlockLayout = ({ layout, setAttributes }) => {
	const layouts = [
		{
			key: 'stack',
			name: 'Stack',
			icon: (
				<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="28" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="6" y="6" width="20" height="2" fill="currentColor" />
					<rect x="6" y="10" width="20" height="6" fill="currentColor" />
					<rect x="6" y="18" width="12" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: 'float-right',
			name: 'Float Right',
			icon: (
				<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="28" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="6" y="6" width="14" height="2" fill="currentColor" />
					<rect x="22" y="6" width="4" height="12" fill="currentColor" />
					<rect x="6" y="10" width="14" height="2" fill="currentColor" />
					<rect x="6" y="14" width="10" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: 'float-left',
			name: 'Float Left',
			icon: (
				<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="28" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="12" y="6" width="14" height="2" fill="currentColor" />
					<rect x="6" y="6" width="4" height="12" fill="currentColor" />
					<rect x="12" y="10" width="14" height="2" fill="currentColor" />
					<rect x="12" y="14" width="10" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: 'split-right',
			name: 'Split Right',
			icon: (
				<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="28" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="6" y="6" width="10" height="2" fill="currentColor" />
					<rect x="18" y="4" width="8" height="16" fill="currentColor" />
					<rect x="6" y="10" width="10" height="2" fill="currentColor" />
					<rect x="6" y="14" width="8" height="2" fill="currentColor" />
				</svg>
			)
		},
		{
			key: 'split-left',
			name: 'Split Left',
			icon: (
				<svg width="32" height="24" viewBox="0 0 32 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<rect x="2" y="2" width="28" height="20" rx="2" fill="currentColor" fillOpacity="0.1" />
					<rect x="16" y="6" width="10" height="2" fill="currentColor" />
					<rect x="6" y="4" width="8" height="16" fill="currentColor" />
					<rect x="16" y="10" width="10" height="2" fill="currentColor" />
					<rect x="16" y="14" width="8" height="2" fill="currentColor" />
				</svg>
			)
		}
	];

	return (
		<div className={css`
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 4px;
            padding: 4px;
            background: #f0f0f0;
            border-radius: 6px;
            width: 100%;
        `}>
			{layouts.map((option) => (
				<button
					key={option.key}
					className={css`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 6px 4px;
                        background: ${layout === option.key ? '#fff' : 'transparent'};
                        color: ${layout === option.key ? 'var(--wp-admin-theme-color)' : '#1e1e1e'};
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.15s ease;
                        box-shadow: ${layout === option.key ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'};

                        &:hover {
                            background: ${layout === option.key ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
                            color: var(--wp-admin-theme-color);
                        }

                        svg {
                            width: 32px;
                            height: 24px;
                            margin-bottom: 3px;
                        }

                        span {
                            font-size: 9px;
                            font-weight: 500;
                            white-space: nowrap;
                            line-height: 1;
                        }
                    `}
					onClick={() => setAttributes({ layout: option.key })}
				>
					{option.icon}
					<span>{option.name}</span>
				</button>
			))}
		</div>
	);
};

export default BlockLayout;
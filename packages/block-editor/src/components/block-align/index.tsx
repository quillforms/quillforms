import { css } from 'emotion';

const AlignControl = ({ value, onChange }) => {
    const alignOptions = [
        {
            key: 'left',
            name: 'Left',
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="3" width="10" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="7" width="14" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="11" width="8" height="1.5" rx="0.75" fill="currentColor" />
                </svg>
            )
        },
        {
            key: 'center',
            name: 'Center',
            icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="10" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="1" y="7" width="14" height="1.5" rx="0.75" fill="currentColor" />
                    <rect x="4" y="11" width="8" height="1.5" rx="0.75" fill="currentColor" />
                </svg>
            )
        }
    ];

    return (
        <div className={css`
            display: flex;
            width: 100%;
            border-radius: 6px;
            overflow: hidden;
            border: 1px solid #ddd;
            background: #fff;
        `}>
            {alignOptions.map((option, index) => (
                <button
                    key={option.key}
                    className={css`
                        flex: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 12px 16px;
                        background: ${value === option.key ? 'var(--wp-admin-theme-color)' : '#fff'};
                        color: ${value === option.key ? '#fff' : '#374151'};
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        position: relative;
                        font-weight: 500;
                        font-size: 14px;

                        ${index > 0 ? `
                            border-left: 1px solid ${value === alignOptions[index - 1].key || value === option.key ? 'transparent' : '#e5e7eb'};
                        ` : ''}

                        &:hover {
                            background: ${value === option.key ? 'var(--wp-admin-theme-color)' : '#f9fafb'};
                            color: ${value === option.key ? '#fff' : '#111827'};
                        }

                        &:active {
                            transform: translateY(0.5px);
                        }

                        &:focus {
                            outline: none;
                            box-shadow: inset 0 0 0 2px var(--wp-admin-theme-color);
                        }

                        svg {
                            width: 16px;
                            height: 16px;
                        }
                    `}
                    onClick={() => onChange(option.key)}
                    title={option.name}
                    aria-label={`Align ${option.name.toLowerCase()}`}
                    aria-pressed={value === option.key}
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};

export default AlignControl;
import { css } from 'emotion';

const AlignControl = ({ value, onChange }) => {
    const alignOptions = [
        {
            key: 'left',
            name: 'Left',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14.8929 6H3.96429C3.43173 6 3 6.43173 3 6.96429C3 7.49685 3.43173 7.92857 3.96429 7.92857H14.8929C15.4254 7.92857 15.8571 7.49685 15.8571 6.96429C15.8571 6.43173 15.4254 6 14.8929 6Z" fill="currentColor" />
                    <path d="M20.0357 11.1431H3.96429C3.43173 11.1431 3 11.5748 3 12.1074C3 12.6399 3.43173 13.0716 3.96429 13.0716H20.0357C20.5683 13.0716 21 12.6399 21 12.1074C21 11.5748 20.5683 11.1431 20.0357 11.1431Z" fill="currentColor" />
                    <path d="M12.3214 16.2856H3.96429C3.43173 16.2856 3 16.7174 3 17.2499C3 17.7825 3.43173 18.2142 3.96429 18.2142H12.3214C12.854 18.2142 13.2857 17.7825 13.2857 17.2499C13.2857 16.7174 12.854 16.2856 12.3214 16.2856Z" fill="currentColor" />
                </svg>
            )
        },
        {
            key: 'center',
            name: 'Center',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17.4641 6H6.53557C6.00301 6 5.57129 6.43173 5.57129 6.96429C5.57129 7.49685 6.00301 7.92857 6.53557 7.92857H17.4641C17.9967 7.92857 18.4284 7.49685 18.4284 6.96429C18.4284 6.43173 17.9967 6 17.4641 6Z" fill="currentColor" />
                    <path d="M20.0357 11.1431H3.96429C3.43173 11.1431 3 11.5748 3 12.1074C3 12.6399 3.43173 13.0716 3.96429 13.0716H20.0357C20.5683 13.0716 21 12.6399 21 12.1074C21 11.5748 20.5683 11.1431 20.0357 11.1431Z" fill="currentColor" />
                    <path d="M16.1784 16.2856H7.82122C7.28866 16.2856 6.85693 16.7174 6.85693 17.2499C6.85693 17.7825 7.28866 18.2142 7.82122 18.2142H16.1784C16.7109 18.2142 17.1426 17.7825 17.1426 17.2499C17.1426 16.7174 16.7109 16.2856 16.1784 16.2856Z" fill="currentColor" />
                </svg>
            )
        },
        {
            key: 'right',
            name: 'Right',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9.10714 6H20.0357C20.5683 6 21 6.43173 21 6.96429C21 7.49685 20.5683 7.92857 20.0357 7.92857H9.10714C8.57458 7.92857 8.14286 7.49685 8.14286 6.96429C8.14286 6.43173 8.57458 6 9.10714 6Z" fill="currentColor" />
                    <path d="M3.96429 11.1431H20.0357C20.5683 11.1431 21 11.5748 21 12.1074C21 12.6399 20.5683 13.0716 20.0357 13.0716H3.96429C3.43173 13.0716 3 12.6399 3 12.1074C3 11.5748 3.43173 11.1431 3.96429 11.1431Z" fill="currentColor" />
                    <path d="M11.6786 16.2856H20.0357C20.5683 16.2856 21 16.7174 21 17.2499C21 17.7825 20.5683 18.2142 20.0357 18.2142H11.6786C11.146 18.2142 10.7143 17.7825 10.7143 17.2499C10.7143 16.7174 11.146 16.2856 11.6786 16.2856Z" fill="currentColor" />
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
                        background: ${value === option.key ? '#FFEEFB' : '#fff'};
                        color: ${value === option.key ? '#B2328C' : '#334155'};
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
                            background: ${value === option.key ? '#FFEEFB' : '#f9fafb'};
                            color: ${value === option.key ? '#B2328C' : '#111827'};
                        }

                        &:active {
                            transform: translateY(0.5px);
                        }

                        &:focus {
                            outline: none;
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
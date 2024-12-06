const InfoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CalculatorIcon = () => {
    return (
        <svg
            viewBox="0 0 24 24"
            width={20}
            height={20}
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

const InfoBox = ({ children, type = 'info' }) => (
    <div className={`info-box ${type}`}>
        {type === 'info' ? <InfoIcon /> : <CalculatorIcon />}
        <span>{children}</span>
    </div>
);

export default InfoBox;
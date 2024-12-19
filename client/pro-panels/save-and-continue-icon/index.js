const Icon = () => {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{ transform: 'scale(1.8) translateX(2px)' }}>
            <path d="M4 12h3" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"></path>

            <circle cx="10" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1"></circle>

            <path d="M8.5 12l1 1L11.5 11" fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" strokeLinejoin="round"></path>

            <path d="M14 12h4m0 0l-1.5-1.5M18 12l-1.5 1.5" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
        </svg>
    );
};

export default Icon;
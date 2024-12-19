const QuizIcon = () => {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            {/* Main circular frame */}
            <path
                d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Split line representing duality of correct/incorrect */}
            <path
                d="M12 3v18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Checkmark side - centered in left half */}
            <path
                d="M5 12L7 14l3-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* X mark side - centered in right half */}
            <path
                d="M17 11l-3 3m0-3l3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default QuizIcon;
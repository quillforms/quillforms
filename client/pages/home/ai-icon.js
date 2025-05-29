/**
 * AI Icon Component for Quill Forms
 * 
 * Follows the same styling pattern as ScratchIcon and TemplateIcon
 */
const AIIcon = () => {
    return (
        <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="quillforms-ai-icon"
        >
            {/* Brain circuit design */}
            <circle cx="20" cy="20" r="16" stroke="#6B54DE" strokeWidth="2" fill="none" />

            {/* Brain left hemisphere */}
            <path
                d="M16 12C14.5 12.5 13 14 13 16C13 18 14 19 13 21C12 23 14 25 16 25"
                stroke="#6B54DE"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />

            {/* Brain right hemisphere */}
            <path
                d="M24 12C25.5 12.5 27 14 27 16C27 18 26 19 27 21C28 23 26 25 24 25"
                stroke="#6B54DE"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
            />

            {/* Brain connections */}
            <path
                d="M16 16H24M16 20H24M16 24H24"
                stroke="#6B54DE"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Circuit dots */}
            <circle cx="16" cy="16" r="1.5" fill="#6B54DE" />
            <circle cx="24" cy="16" r="1.5" fill="#6B54DE" />
            <circle cx="16" cy="20" r="1.5" fill="#6B54DE" />
            <circle cx="24" cy="20" r="1.5" fill="#6B54DE" />
            <circle cx="16" cy="24" r="1.5" fill="#6B54DE" />
            <circle cx="24" cy="24" r="1.5" fill="#6B54DE" />

            {/* Electricity/spark element */}
            <path
                d="M20 8L21 14L19 16L21 19L19 22L21 28"
                stroke="#6B54DE"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default AIIcon;
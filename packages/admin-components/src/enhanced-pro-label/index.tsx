/**
 * External Dependencies
 */
import { css } from 'emotion';

const ProLabel = () => (
    <span className={css`
        background: linear-gradient(45deg, #FF6B6B, #FF8E53);
        color: white;
        font-size: 11px;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 12px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        display: inline-flex;
        align-items: center;
        margin-left: 8px;
        box-shadow: 0 2px 4px rgba(255, 107, 107, 0.2);
        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
        margin-bottom: 15px;
        &:before {
            content: '⭐';
            margin-right: 4px;
            font-size: 10px;
        }
        
        &:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
            transition: all 0.2s ease;
        }
    `}>
        Pro Feature
    </span>
);

export default ProLabel;
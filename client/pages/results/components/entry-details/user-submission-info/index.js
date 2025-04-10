/**
 * UserSubmissionInfo Component
 * Displays information about a submission made by a logged-in user
 */
import { __ } from '@wordpress/i18n';
import { css } from 'emotion';

const UserSubmissionInfo = ({ entry }) => {
    // Check if this entry was submitted by a logged-in user
    const hasUserData = entry?.meta?.user_id?.value && entry?.meta?.user_email?.value;

    if (!hasUserData) {
        return null;
    }

    const userId = entry.meta.user_id.value;
    const userEmail = entry.meta.user_email.value;
    const userName = entry.meta.user_name?.value || entry.meta.user_login?.value || __('WordPress User', 'quillforms');
    const editUserUrl = entry.meta.edit_user_url?.value;

    return (
        <div className={css`
            margin-top: 15px;
            margin-bottom: 25px;
            padding: 12px 16px;
            background-color: #f0f6ff;
            border-left: 4px solid #5181e0;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
        `}>
            <div className={css`
                display: flex;
                align-items: center;
            `}>
                <div className={css`
                    width: 32px;
                    height: 32px;
                    background-color: #5181e0;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 12px;
                    color: white;
                    font-weight: 500;
                `}>
                    {userName.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div className={css`
                        font-weight: 500;
                        color: #2c3338;
                    `}>
                        {__('Submitted by WordPress User', 'quillforms')}
                    </div>
                    <div className={css`
                        color: #50575e;
                        margin-top: 2px;
                    `}>
                        {userName} ({userEmail})
                    </div>
                </div>
            </div>

            <a
                href={editUserUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={css`
                    display: inline-flex;
                    align-items: center;
                    background-color: #fff;
                    color: #2271b1;
                    border: 1px solid #2271b1;
                    border-radius: 4px;
                    padding: 6px 12px;
                    font-size: 13px;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                    
                    &:hover {
                        background-color: #f6f7f7;
                    }
                    
                    svg {
                        margin-left: 6px;
                        height: 16px;
                        width: 16px;
                    }
                `}
            >
                {__('Edit User', 'quillforms')}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                    <path d="M18.2 17c0 .7-.6 1.2-1.2 1.2H7c-.7 0-1.2-.6-1.2-1.2V7c0-.7.6-1.2 1.2-1.2h3.2V4.2H7C5.5 4.2 4.2 5.5 4.2 7v10c0 1.5 1.2 2.8 2.8 2.8h10c1.5 0 2.8-1.2 2.8-2.8v-3.6h-1.5V17zM14.9 3v1.5h3.7l-6.4 6.4 1.1 1.1 6.4-6.4v3.7h1.5V3h-6.3z"></path>
                </svg>
            </a>
        </div>
    );
};

export default UserSubmissionInfo;
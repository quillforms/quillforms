// ProButton.tsx
import { NavLink } from '@quillforms/navigation';
import ConfigApi from '@quillforms/config';
import { css } from 'emotion';

interface ProButtonProps {
    addonSlug: string;
    className?: string;
}

const ProButton = ({ addonSlug, className = '' }: ProButtonProps) => {
    const license = ConfigApi.getLicense();
    const addon = ConfigApi.getStoreAddons()[addonSlug];
    const isWPEnv = ConfigApi.isWPEnv();
    const featurePlanLabel = ConfigApi.getPlans()[addon.plan].label;
    const isPlanAccessible = ConfigApi.isPlanAccessible(addon.plan);

    let actionText = '';
    let actionLink = '';
    let isExternalLink = true;

    // Determine action based on status
    if (isWPEnv && addon.is_installed) {
        if (addon.is_active) {
            if (license?.status !== 'valid') {
                actionText = 'Renew License';
                actionLink = 'https://quillforms.com';
            } else if (!isPlanAccessible) {
                actionText = `Upgrade to ${featurePlanLabel}`;
                actionLink = 'https://quillforms.com';
            }
        } else {
            actionText = 'Activate Addon';
            actionLink = '/admin.php?page=quillforms&path=addons';
            isExternalLink = false;
        }
    } else {
        if (license?.status === 'valid' && isPlanAccessible) {
            actionText = 'Install Addon';
            actionLink = '/admin.php?page=quillforms&path=addons';
            isExternalLink = false;
        } else {
            actionText = `Upgrade to ${featurePlanLabel}`;
            actionLink = isWPEnv ? 'https://quillforms.com' : '/admin.php?page=quillforms&path=checkout';
            isExternalLink = isWPEnv;
        }
    }

    const ActionComponent = isExternalLink ? 'a' : NavLink;
    const actionProps = isExternalLink ? {
        href: actionLink,
        target: "_blank",
        rel: "noopener noreferrer"
    } : {
        to: actionLink
    };

    const buttonStyles = css`
        padding: 8px 24px;
        background: #1a73e8;
        color: white;
        border: none;
        border-radius: 16px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;

        &:hover {
            background: #1557b0;
        }

        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.4);
        }
    `;

    return (
        <ActionComponent
            className={`${buttonStyles} ${className}`}
            {...actionProps}
        >
            {actionText}
        </ActionComponent>
    );
};

export default ProButton;
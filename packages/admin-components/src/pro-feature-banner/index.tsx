import { NavLink } from '@quillforms/navigation';
import ConfigApi from '@quillforms/config';
import { css } from 'emotion';

interface ProFeatureBannerProps {
    featureName: string;
    addonSlug: string;
}

const ProFeatureBanner = ({ featureName, addonSlug }: ProFeatureBannerProps) => {
    const license = ConfigApi.getLicense();
    const addon = ConfigApi.getStoreAddons()[addonSlug];
    const isWPEnv = ConfigApi.isWPEnv();
    const featurePlanLabel = ConfigApi.getPlans()[addon.plan].label;
    const isPlanAccessible = ConfigApi.isPlanAccessible(addon.plan);

    let bannerText = '';
    let actionText = '';
    let actionLink = '';
    let isExternalLink = true;

    // Determine banner text and action based on status
    if (isWPEnv && addon.is_installed) {
        if (addon.is_active) {
            if (license?.status !== 'valid') {
                bannerText = `${featureName} needs license renewal`;
                actionText = 'Renew License';
                actionLink = 'https://quillforms.com';
            } else if (!isPlanAccessible) {
                bannerText = `${featureName} needs ${featurePlanLabel} plan`;
                actionText = `Upgrade to ${featurePlanLabel}`;
                actionLink = 'https://quillforms.com';
            }
        } else {
            bannerText = `${featureName} needs activation`;
            actionText = 'Activate Addon';
            actionLink = '/admin.php?page=quillforms&path=addons';
            isExternalLink = false;
        }
    } else {
        if (license?.status === 'valid' && isPlanAccessible) {
            bannerText = `${featureName} needs installation`;
            actionText = 'Install Addon';
            actionLink = '/admin.php?page=quillforms&path=addons';
            isExternalLink = false;
        } else {
            bannerText = `${featureName} is a Pro feature`;
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

    return (
        <div className={css`
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 24px;
            box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
            z-index: 1000;

            @media (max-width: 768px) {
                flex-direction: column;
                gap: 16px;
            }
        `}>
            <div className={css`
                font-size: 16px;
                color: #202124;
                display: flex;
                align-items: center;
                gap: 8px;
            `}>
                <span className={css`
                    padding: 2px 8px;
                    background: #FFD700;
                    color: #202124;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                `}>
                    PRO
                </span>
                {bannerText}
            </div>

            <ActionComponent
                className={css`
                    padding: 8px 24px;
                    background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    text-decoration: none;
                    box-shadow: 0 4px 20px rgba(0, 102, 204, 0.15);


                    &:hover {
                        background: linear-gradient(135deg, #0052a3 0%, #004080 100%);   
                         transform: translateY(-1px);
                        box-shadow: 0 6px 25px rgba(0, 102, 204, 0.25);
                        color: white;
                    }
                `}
                {...actionProps}
            >
                {actionText}
            </ActionComponent>
        </div>
    );
};

export default ProFeatureBanner;
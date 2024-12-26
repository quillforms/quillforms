import { useState, useEffect } from 'react';
import ConfigApi from '@quillforms/config';

interface AddonStatus {
    isInstalled: boolean;
    isActive: boolean;
    isLicenseValid: boolean;
    isPlanAccessible: boolean;
    featurePlanLabel: string;
    addonName: string;
    loading: boolean;
}

const useAddonStatus = (addonSlug: string): AddonStatus => {
    const [status, setStatus] = useState<AddonStatus>({
        isInstalled: false,
        isActive: false,
        isLicenseValid: false,
        isPlanAccessible: false,
        featurePlanLabel: '',
        addonName: '',
        loading: true,
    });

    useEffect(() => {
        // Simulate fetching addon details
        const fetchAddonStatus = async () => {
            const license = ConfigApi.getLicense();
            const addon = ConfigApi.getStoreAddons()[addonSlug];
            const isWPEnv = ConfigApi.isWPEnv();
            const featurePlanLabel = ConfigApi.getPlans()[addon.plan]?.label || 'Pro';

            setStatus({
                isInstalled: isWPEnv && addon?.is_installed,
                isActive: addon?.is_active || false,
                isLicenseValid: license?.status === 'valid',
                isPlanAccessible: ConfigApi.isPlanAccessible(addon?.plan),
                featurePlanLabel,
                addonName: addon?.name || '',
                loading: false,
            });
        };

        fetchAddonStatus();
    }, [addonSlug]);

    return status;
};

export default useAddonStatus;
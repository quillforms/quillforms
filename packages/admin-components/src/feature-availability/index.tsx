/**
 * QuillForms Dependencies
 */
import ConfigApi from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { Icon } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import lockIcon from './lock-icon';

interface Props {
	featureName: string;
	planKey: string;
	showLockIcon: boolean;
}

const FeatureAvailability: React.FC< Props > = ( {
	featureName,
	planKey,
	showLockIcon,
} ) => {
	const license = ConfigApi.getLicense();
	const featurePlanLabel = ConfigApi.getPlans()[ planKey ].label;
	const isPlanAccessible = ConfigApi.isPlanAccessible( planKey );

	let content = <div></div>;

	if ( license?.status === 'valid' && isPlanAccessible ) {
		content = <div>{ featureName } is already available on your plan.</div>;
	} else {
		content = (
			<div>
				{ showLockIcon && (
					<Icon
						className="feature-availability-lock-icon"
						icon={ lockIcon }
						size={ 120 }
					/>
				) }

				<p
					className={ css`
						font-size: 15px;
					` }
				>
					We're sorry, { featureName } is not available
					<br />
					on your plan. Please upgrade to the {
						featurePlanLabel
					}{ ' ' }
					plan to unlock
					<br />
					all of { featurePlanLabel } features.
				</p>
				<a
					href="https://quillforms.com"
					target="_blank"
					className="feature-availability-upgrade-button"
				>
					Upgrade to { featurePlanLabel }!
				</a>
			</div>
		);
	}

	return <div className="feature-availability">{ content }</div>;
};

export default FeatureAvailability;

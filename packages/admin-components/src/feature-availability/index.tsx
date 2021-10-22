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

	if ( license?.status === 'valid' && isPlanAccessible ) {
		return <div>{ featureName } is already available on your plan.</div>;
	} else {
		return (
			<div
				className={ css`
					text-align: center;
				` }
			>
				{ showLockIcon && (
					<Icon
						className={ css`
							fill: #333;
						` }
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
					className={ css`
						color: #fff !important;
						padding: 15px 20px;
						display: inline-flex;
						-webkit-box-align: center;
						align-items: center;
						color: rgb( 255, 255, 255 );
						text-decoration: none;
						border-radius: 5px;
						background: linear-gradient(
							42deg,
							rgb( 235, 54, 221 ),
							rgb( 238, 142, 22 )
						);
						font-size: 15px;
						text-transform: uppercase;
						font-weight: bold;
					` }
				>
					Upgrade to { featurePlanLabel }!
				</a>
			</div>
		);
	}
};

export default FeatureAvailability;

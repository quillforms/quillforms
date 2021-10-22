/**
 * QuillForms Dependencies
 */
import { NavLink } from '@quillforms/navigation';
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
	addonSlug: string;
	showLockIcon: boolean;
}

const AddonFeatureAvailability: React.FC< Props > = ( {
	featureName,
	addonSlug,
	showLockIcon,
} ) => {
	const license = ConfigApi.getLicense();
	const addon = ConfigApi.getStoreAddons()[ addonSlug ];
	const featurePlanLabel = ConfigApi.getPlans()[ addon.plan ].label;
	const isPlanAccessible = ConfigApi.isPlanAccessible( addon.plan );

	let content = <div></div>;

	// if addon installed.
	if ( addon.is_installed ) {
		// license note in case of invalid or low level license.
		let licenseNote = <div></div>;
		if ( license?.status !== 'valid' ) {
			licenseNote = (
				<div>
					Renewing your license is recommended to receive updates for
					this addon.
				</div>
			);
		} else if ( ! isPlanAccessible ) {
			licenseNote = (
				<div>
					Upgrading your license to { featurePlanLabel } is
					recommended to receive updates for this addon.
				</div>
			);
		}
		// if addon is active, shouldn't be reached in most cases.
		if ( addon.is_active ) {
			content = (
				<div>
					<div>{ featureName } is already available.</div>
					{ licenseNote }
				</div>
			);
			// else, the addon is not active -but installed-.
		} else {
			content = (
				<div>
					<div>{ featureName } is already available.</div>
					<div>
						Please activate <b>{ addon.name }</b> addon from{ ' ' }
						<NavLink
							to={ `/admin.php?page=quillforms&path=addons` }
						>
							addons page
						</NavLink>{ ' ' }
						to use it.
					</div>
					{ licenseNote }
				</div>
			);
		}
		// else, addon is not installed.
	} else {
		// if license is valid and the feature plan is accessible.
		if ( license?.status === 'valid' && isPlanAccessible ) {
			content = (
				<div>
					<div>{ featureName } is available for your plan.</div>
					<div>
						Please install and activate { addon.name } addon from{ ' ' }
						<NavLink
							to={ `/admin.php?page=quillforms&path=addons` }
						>
							addons page
						</NavLink>{ ' ' }
						to use it.
					</div>
				</div>
			);
			// else, no license or the license is invalid or the feature of addon require higher plan.
		} else {
			content = (
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
	}

	return (
		<div
			className={ css`
				text-align: center;
			` }
		>
			{ content }
		</div>
	);
};

export default AddonFeatureAvailability;

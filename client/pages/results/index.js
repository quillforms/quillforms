/**
 * QuillForms Dependencies
 */
import { NavLink } from '@quillforms/navigation';
import { Button } from '@quillforms/admin-components';
import configApi from '@quillforms/config';

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
import './style.scss';
import lockIcon from './lock-icon';

const ResultsPage = () => {
	const license = configApi.getLicense();
	const addon = configApi.getStoreAddons().entries;

	return (
		<div className="quillforms-results-page">
			{ license?.status === 'valid' ? (
				addon.is_active ? (
					<div>Entries addon isn't working well.</div>
				) : (
					<div>
						Please install and activate entries addon from here{ ' ' }
						<NavLink
							to={ `/admin.php?page=quillforms&path=addons` }
						>
							Store Addons Page
						</NavLink>
					</div>
				)
			) : (
				<div
					className={ css`
						text-align: center;
					` }
				>
					<Icon
						className={ css`
							fill: #333;
						` }
						icon={ lockIcon }
						size={ 120 }
					/>
					<p
						className={ css`
							font-size: 15px;
						` }
					>
						We're sorry, the Results is not available
						<br />
						on your plan. Please upgrade to the PRO plan to unlock
						<br />
						all of PRO features.
					</p>
					<a
						href="https://quillforms.com"
						className="admin-components-button is-primary"
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
						Upgrade to pro!
					</a>
				</div>
			) }
		</div>
	);
};

export default ResultsPage;

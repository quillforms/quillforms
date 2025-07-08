/* eslint-disable no-shadow */
/**
 * QuillForms Dependencies
 */
import { NavLink } from '@quillforms/navigation';
import ConfigApi from '@quillforms/config';
import { blockColors } from '@quillforms/blocks';

/**
 * Internal Dependencies
 */
import BlockTypesListItem from '../block-types-list-item';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { keys, map, pickBy } from 'lodash';
import { css } from 'emotion';
import {
	CaledlyIcon,
	GeolocationIcon,
	FileIcon,
	OpinionScaleIcon,
	PhoneIcon,
	PictureChoiceIcon,
	RatingIcon,
	SignatureIcon,
	ThankYouIcon,
	CalendarPickerIcon,
	InputMaskIcon
} from './pro-blocks-icons';
import ProLabel from '../pro-label';
import { Button } from '../button';

interface Props {
	destinationIndex: number;
	parent?: string;
}
const BlockTypesList: React.FC<Props> = ({ destinationIndex, parent }) => {
	let { blockTypes, welcomeScreensLength, doesPartialSubmissionPointExist } = useSelect((select) => {
		return {
			blockTypes: select('quillForms/blocks').getBlockTypes(),
			welcomeScreensLength: select(
				'quillForms/block-editor'
				// @ts-expect-error
			).getWelcomeScreensLength(),
			doesPartialSubmissionPointExist: select(
				'quillForms/block-editor'
				// @ts-expect-error
			).doesPartialSubmissionPointExist(),
		};
	});

	const license = ConfigApi.getLicense();

	if (parent) {
		blockTypes = pickBy(blockTypes, (blockType) => {
			return (
				(blockType.supports.editable === true &&
					!blockType.supports.innerBlocks) || blockType.name === 'statement'
			);
		});
	}
	const proBlocks = {
		file: {
			title: 'File',
			color: blockColors.file,
			icon: <FileIcon />,
		},
		'calendar-picker': {
			title: 'Calendar Picker',
			color: blockColors['calendar-picker'],
			icon: <CalendarPickerIcon />,
		},
		'auto-complete-address': {
			title: 'Auto Complete Address',
			color: blockColors['auto-complete-address'],
			icon: <GeolocationIcon />,
		},
		phone: {
			title: 'Phone',
			color: blockColors.phone,
			icon: <PhoneIcon />,
		},
		'picture-choice': {
			title: 'Picture Choice',
			color: blockColors['picture-choice'],
			icon: <PictureChoiceIcon />,
		},
		signature: {
			title: 'Signature',
			color: blockColors.signature,
			icon: <SignatureIcon />,
		},
		'thankyou-screen': {
			title: 'Custom Thank You Screen & Redirect',
			color: blockColors['thankyou-screen'],
			icon: <ThankYouIcon />,
		},
		'opinion-scale': {
			title: 'Opinion Scale',
			color: blockColors['opinion-scale'],
			icon: <OpinionScaleIcon />,
		},
		rating: {
			title: 'Rating',
			color: blockColors.rating,
			icon: <RatingIcon />,
		},
		calendly: {
			title: 'Calendly',
			color: '#fff',
			icon: <CaledlyIcon />,
		},
		// 'auto-complete-address': {
		// 	title: 'Auto Complete Address',
		// 	color: blockColors['auto-complete-address'],
		// 	icon: <AutoCompleteAddressIcon />,
		// },
		"cal.com": {
			title: 'Cal.com',
			color: '#fff',
			icon: () => {
				return (
					<i
						style={{
							verticalAlign: 'text-bottom',
							fontWeight: 'bold',
							color: '#fff',
						}}
					>
						Cal
					</i>
				);
			}
		},
		"input-mask": {
			title: 'Input Mask',
			color: blockColors['input-mask'],
			icon: <InputMaskIcon />

		}
	};
	return (
		<div className="admin-components-block-types-list">
			{map(keys(blockTypes), (blockName, index) => {
				let isDragDisabled = false;
				if (
					blockName === 'welcome-screen' &&
					welcomeScreensLength >= 1
				) {
					isDragDisabled = true;
				}

				if (blockName === 'partial-submission-point' && doesPartialSubmissionPointExist) {
					isDragDisabled = true;
				}

				return (
					<div
						key={blockName}
					>
						<div
							className={classnames(
								'admin-components-blocks-list__item-wrapper'
							)}
						>
							<BlockTypesListItem
								blockName={blockName}
								disabled={isDragDisabled}
							/>
						</div>
					</div>
				);
			})}
			<>
				{Object.keys(proBlocks).map((blockName) => {
					if (!blockTypes[blockName]) {
						return (
							<div
								key={blockName}
								className={
									'admin-components-blocks-list__item-wrapper'
								}
							>
								<div className="admin-components-blocks-list-item disabled">
									<span
										className="admin-components-blocks-list-item__icon-wrapper"
										style={{
											backgroundColor:
												proBlocks[blockName].color,
										}}
									>
										<span className="admin-components-blocks-list-item__icon">
											{proBlocks[blockName].icon}
										</span>
									</span>
									<span className="admin-components-blocks-list-item__block-name">
										{proBlocks[blockName].title}
									</span>
									{license?.status !== 'valid' ? (
										<ProLabel />
									) : (
										<Button
											isPrimary
											isButton
											className={css`
												padding: 0 !important;
												height: auto !important;
												a {
													background: inherit;
													padding: 5px 8px;
													font-size: 13px;
													font-weight: normal;
													border-radius: 4px;
													overflow: hidden;
													text-decoration: none;
													color: #fff;
												}
											` }
										>
											<NavLink
												to={`/admin.php?page=quillforms&path=addons`}
											>
												Install
											</NavLink>
										</Button>
									)}
								</div>
							</div>
						);
					}
					return null;
				})}
			</>
		</div>
	);
};

export default BlockTypesList;

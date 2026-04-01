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
import { useSelect } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { pickBy } from 'lodash';
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
	InputMaskIcon,
	CalIcon,
} from './pro-blocks-icons';
import ProLabel from '../pro-label';
import { Button } from '../button';

interface Props {
	destinationIndex: number;
	parent?: string;
}
const BlockTypesList: React.FC<Props> = ({ destinationIndex, parent }) => {
	const [searchTerm, setSearchTerm] = useState('');
	let { blockTypes, welcomeScreensLength, doesPartialSubmissionPointExist } =
		useSelect((select) => {
			const blocksSelect = select('quillForms/blocks') as any;
			return {
				blockTypes: blocksSelect.getBlockTypes(),
				welcomeScreensLength: select(
					'quillForms/block-editor'
					// @ts-expect-error
				).getWelcomeScreensLength(),
				doesPartialSubmissionPointExist: select(
					'quillForms/block-editor'
					// @ts-expect-error
				).doesPartialSubmissionPointExist(),
			};
		}, []);

	const license = ConfigApi.getLicense();

	if (parent) {
		blockTypes = pickBy(blockTypes, (blockType) => {
			return (
				(blockType.supports.editable === true &&
					!blockType.supports.innerBlocks) ||
				blockType.name === 'statement'
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
			color: '#F2F4FC',
			icon: <CaledlyIcon />,
		},
		'address': {
			title: 'Auto Complete Google Address',
			color: blockColors['address'],
			icon: <GeolocationIcon />,
		},
		"cal.com": {
			title: 'Cal.com',
			color: '#F2F4FC',
			icon: <CalIcon />,
		},
		'input-mask': {
			title: 'Input Mask',
			color: blockColors['input-mask'],
			icon: <InputMaskIcon />,
		},
	};

	const normalizedSearchTerm = searchTerm.trim().toLowerCase();
	const matchesSearch = (title?: string, name?: string): boolean => {
		if (!normalizedSearchTerm) return true;
		const normalizedTitle = String(title || '').toLowerCase();
		const normalizedName = String(name || '').toLowerCase();
		return (
			normalizedTitle.includes(normalizedSearchTerm) ||
			normalizedName.includes(normalizedSearchTerm)
		);
	};

	const blockGroups = [
		{
			title: 'Intro & Outro Screens',
			blocks: ['welcome-screen', 'thankyou-screen', 'statement'],
		},
		{
			title: 'Text & Contact Inputs',
			blocks: [
				'short-text',
				'long-text',
				'email',
				'phone',
				'website',
				'number',
				'input-mask',
				'address',
			],
		},
		{
			title: 'Choices & Ratings',
			blocks: [
				'multiple-choice',
				'dropdown',
				'opinion-scale',
				'picture-choice',
				'slider',
				'rating',
				'legal',
			],
		},
		{
			title: 'Date & Scheduling',
			blocks: ['date', 'calendar-picker', 'quill-booking', 'calendly', 'cal.com'],
		},
		{
			title: 'Uploads & Signatures',
			blocks: ['file', 'signature'],
		},
		{
			title: 'Other Form Elements',
			blocks: ['group', 'partial-submission-point'],
		},
	];

	const renderBlockItem = (blockName: string, index: number) => {
		const blockType = blockTypes[blockName];
		const proBlock = proBlocks[blockName];

		if (
			!matchesSearch(blockType?.title || proBlock?.title, blockName)
		) {
			return null;
		}

		let isDragDisabled = false;
		if (blockName === 'welcome-screen' && welcomeScreensLength >= 1) {
			isDragDisabled = true;
		}
		if (
			blockName === 'partial-submission-point' &&
			doesPartialSubmissionPointExist
		) {
			isDragDisabled = true;
		}

		if (blockType && blockName !== 'autocomplete-address') {
			return (
				<div
					key={blockName}
					className={classnames('admin-components-blocks-list__item-wrapper')}
				>
					<BlockTypesListItem
						blockName={blockName}
						disabled={isDragDisabled}
						index={index}
						destinationIndex={destinationIndex}
					/>
				</div>
			);
		}

		if (proBlock) {
			return (
				<div
					key={blockName}
					className="admin-components-blocks-list__item-wrapper"
				>
					<div className="admin-components-blocks-list-item cursor-not-allowed">
						<span
							className="admin-components-blocks-list-item__icon-wrapper"
							style={{
								backgroundColor: proBlock.color,
							}}
						>
							<span className="admin-components-blocks-list-item__icon">
								{proBlock.icon}
							</span>
						</span>
						<span className="admin-components-blocks-list-item__block-name">
							{proBlock.title}
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
								`}
							>
								<NavLink to={`/admin.php?page=quillforms&path=addons`}>
									Install
								</NavLink>
							</Button>
						)}
					</div>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="admin-components-block-types-list">
			<div className="admin-components-block-types-list__search">
				<span className="admin-components-block-types-list__search-icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M20.3235 20.9964C20.1921 20.8927 20.049 20.8012 19.9312 20.6838C18.3637 19.122 16.8 17.5568 15.2362 15.9912C15.187 15.9419 15.1466 15.8828 15.1194 15.8495C14.6811 16.1395 14.2831 16.4366 13.8541 16.6797C12.6067 17.3869 11.2617 17.6798 9.82795 17.5939C6.7033 17.4062 4.0198 15.1732 3.24404 12.1659C3.14549 11.7834 3.10278 11.3859 3.03379 10.9959C3.02487 10.9448 3.01126 10.8941 3 10.8434C3 10.4802 3 10.1174 3 9.75413C3.04505 9.47302 3.0765 9.18909 3.13751 8.91126C3.7354 6.20758 5.32636 4.32988 7.93289 3.41285C11.9642 1.99461 16.3264 4.36132 17.3721 8.50718C17.9756 10.8992 17.4481 13.0684 15.9031 14.9907C15.8811 15.0179 15.8595 15.0456 15.8018 15.1122C15.86 15.1516 15.9261 15.1835 15.9749 15.2324C17.5621 16.8167 19.1479 18.4025 20.7332 19.9883C21.1279 20.383 21.0843 20.7214 20.6047 20.9964H20.3235ZM10.301 16.5492C13.7462 16.5492 16.5386 13.7601 16.5423 10.314C16.5461 6.86742 13.7349 4.05486 10.294 4.06237C6.85771 4.06988 4.04984 6.88197 4.05359 10.3126C4.05735 13.7512 6.86005 16.5488 10.301 16.5492Z"
							fill="#777777"
						/>
					</svg>
				</span>
				<input
					type="text"
					className="admin-components-block-types-list__search-input"
					placeholder="Search blocks..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			{blockGroups.map((group) => {
				const groupItems = group.blocks
					.map((blockName, index) => renderBlockItem(blockName, index))
					.filter(Boolean);

				if (groupItems.length === 0) {
					return null;
				}

				return (
					<div
						key={group.title}
						className="admin-components-block-types-list__group"
					>
						<div className="admin-components-block-types-list__group-title">
							{group.title}
						</div>
						<div className="admin-components-block-types-list__group-items">
							{groupItems}
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default BlockTypesList;

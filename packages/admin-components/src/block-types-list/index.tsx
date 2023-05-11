/* eslint-disable no-shadow */
/**
 * QuillForms Dependencies
 */
import { NavLink } from '@quillforms/navigation';
import ConfigApi from '@quillforms/config';

/**
 * Internal Dependencies
 */
import BlockTypesListItem from '../block-types-list-item';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { keys, map, pickBy } from 'lodash';
import { css } from 'emotion';
import {
	CaledlyIcon,
	FileIcon,
	OpinionScaleIcon,
	PhoneIcon,
	PictureChoiceIcon,
	RatingIcon,
	SignatureIcon,
	ThankYouIcon,
	CalendarPickerIcon,
} from './pro-blocks-icons';
import ProLabel from '../pro-label';
import { Button } from '../button';

interface Props {
	destinationIndex: number;
	parent?: string;
}
const BlockTypesList: React.FC<Props> = ({ destinationIndex, parent }) => {
	let { blockTypes, welcomeScreensLength } = useSelect((select) => {
		return {
			blockTypes: select('quillForms/blocks').getBlockTypes(),
			welcomeScreensLength: select(
				'quillForms/block-editor'
				// @ts-expect-error
			).getWelcomeScreensLength(),
		};
	});
	const license = ConfigApi.getLicense();

	if (parent) {
		blockTypes = pickBy(blockTypes, (blockType) => {
			return (
				blockType.supports.editable === true &&
				!blockType.supports.innerBlocks
			);
		});
	}
	const proBlocks = {
		file: {
			title: 'File',
			color: '#ff9381',
			icon: <FileIcon />,
		},
		'calendar-picker': {
			title: 'Calendar Picker',
			color: '#28354c',
			icon: <CalendarPickerIcon />,
		},
		phone: {
			title: 'Phone',
			color: '#2cc31a',
			icon: <PhoneIcon />,
		},
		'picture-choice': {
			title: 'Picture Choice',
			color: '#0d775f',
			icon: <PictureChoiceIcon />,
		},
		signature: {
			title: 'Signature',
			color: '#2eaf8b',
			icon: <SignatureIcon />,
		},
		'thankyou-screen': {
			title: 'Custom Thank You Screen & Redirect',
			color: '#bf5c73',
			icon: <ThankYouIcon />,
		},
		'opinion-scale': {
			title: 'Opinion Scale',
			color: '#5d4096',
			icon: <OpinionScaleIcon />,
		},
		rating: {
			title: 'Rating',
			color: '#ffd010',
			icon: <RatingIcon />,
		},
		calendly: {
			title: 'Calendly',
			color: '#fff',
			icon: <CaledlyIcon />,
		},
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

				return (
					<div
						key={blockName}
						style={{
							overflow: 'auto',
						}}
					>
						<div
							className={classnames(
								'admin-components-blocks-list__item-wrapper'
							)}
						>
							<BlockTypesListItem
								destinationIndex={destinationIndex}
								parent={parent}
								index={index}
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
												background-color: #1e87f0;

												a {
													text-decoration: none;
													color: #fff;
													padding: 2px 8px;
													background-color: #1e87f0;
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

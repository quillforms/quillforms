/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/**
 * WordPress Dependencies
 */
import { Icon, Dropdown } from '@wordpress/components';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import BlockTypesList from '../block-types-list';

interface Props {
	destinationIndex: number;
	color: string;
	parent?: string;
}
const BlockTypesListDropdown: React.FC<Props> = ({
	destinationIndex,
	color = 'primary',
	parent,
}) => {
	return (
		<Dropdown
			position="bottom right"
			className={css`
				.components-popover__content {
					width: 250px;
					max-height: 350px !important;
					overflow-y: hidden !important;

					& > div {
						padding: 0 !important;
					}
				}
			` }
			renderToggle={({ isOpen, onToggle }) => (
				<div
					onClick={onToggle}
					aria-expanded={isOpen}
					className={css`
						margin: 0 10px;
						background: ${color === 'primary'
							? `#3a3a3a`
							: '#fff'};
						cursor: pointer;
						width: 25px;
						height: 25px;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 50%;
						span {
							color: ${color === 'primary' ? `#fff` : `#333`};
							font-size: inherit;
							width: auto;
							height: auto;
						}
					` }
				>
					<Icon icon="plus"></Icon>
				</div>
			)}
			renderContent={() => (
				<>
					<p
						className={css`
							font-weight: bold;
							padding: 0 15px;
							user-select: none;
						` }
					>
						Choose a question type
					</p>

					<BlockTypesList
						parent={parent}
						destinationIndex={destinationIndex}
					/>
				</>
			)}
		/>
	);
};

export default BlockTypesListDropdown;

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { Icon, Tooltip } from '@wordpress/components';

/**
  External Dependencies
 */
import { sortBy } from 'lodash';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import NavItem from '../panel-item';
import MainPanelIcon from '../../panel/icon';
import PlusIcon from './plus-icon';

const BuilderPanelsBar = () => {
	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');
	const { currentPanelName, panels } = useSelect((select) => {
		return {
			currentPanelName: select(
				'quillForms/builder-panels'
			).getCurrentPanelName(),
			panels: select('quillForms/builder-panels').getVisiblePanels(),
		};
	});

	return (
		<div className="builder-core-builder-panels-bar">
			<div
				className={classnames('builder-core-builder-panel-nav-item')}>
				<Tooltip text={'Add'} position="middle right">
					<div
						role="presentation"
						onClick={() => {
							setCurrentPanel('');
						}}
						className="builder-core-builder-panel-nav-item__icon"
					>
						<PlusIcon />
					</div>
				</Tooltip>
			</div>
			<div className="builder-core-panel-navbar__separator"></div>

			<div
				className={classnames('builder-core-builder-panel-nav-item', {
					active: !currentPanelName ? true : false,
				})}
			>
				<Tooltip text={'Main'} position="middle right">
					<div
						role="presentation"
						onClick={() => {
							setCurrentPanel('');
						}}
						className="builder-core-builder-panel-nav-item__icon"
					>
						<Icon icon={MainPanelIcon} />
					</div>
				</Tooltip>
			</div>
			{sortBy(panels, ['position']).map((panel, index) => {
				const isSelected = panel.name === currentPanelName;
				return (
					<NavItem
						index={index}
						key={panel.name}
						panelName={panel.name}
						isSelected={isSelected}
					/>
				);
			})}
		</div>
	);
};

export default BuilderPanelsBar;

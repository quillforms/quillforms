/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { sortBy } from 'lodash';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import PanelHeader from '../panel-header';
import SubPanel from '../subpanel';
const Panel = () => {
	const { areaToShow, currentPanel } = useSelect((select) => {
		return {
			areaToShow: select('quillForms/builder-panels').getAreaToShow(),
			currentPanel: select(
				'quillForms/builder-panels'
			).getCurrentPanel(),
		};
	});

	const { setCurrentSubPanel } = useDispatch('quillForms/builder-panels');

	useEffect(() => {
		if (
			currentPanel?.mode === 'parent' &&
			currentPanel?.subPanels &&
			currentPanel?.subPanels?.length > 0
		) {
			setCurrentSubPanel(
				sortBy(currentPanel.subPanels, ['position'])[0].name
			);
		} else {
			setCurrentSubPanel('');
		}
	}, [currentPanel]);

	return (
		<div
			className={`builder-core-panel builder-core-${currentPanel?.name}-panel`}
			style={{
				width:
					areaToShow === 'drop-area' || areaToShow == 'preview-area'
						? '300px'
						: '100%',

				// position: areaToShow ? 'relative' : 'absolute',
				// zIndex: areaToShow ? 'inherit' : 111111111111111111,
			}}
		>
			<PanelHeader />
			{currentPanel && (
				<div className="builder-core-panel__content-wrapper">
					{currentPanel.mode === 'single' ? (
						// @ts-expect-error
						<currentPanel.render />
					) : (
						<SubPanel />
					)}
				</div>
			)}
		</div>
	);
};
export default Panel;

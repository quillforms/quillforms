/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { set, sortBy } from 'lodash';
import classnames from 'classnames';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import PanelHeader from '../panel-header';
import SubPanel from '../subpanel';
import { Modal } from '@wordpress/components';

const Panel = () => {
	const { panelType, currentPanel } = useSelect((select) => {
		return {
			currentPanel: select(
				'quillForms/builder-panels'
			).getCurrentPanel(),
			panelType: select('quillForms/builder-panels').getCurrentPanelType(),
		};
	});

	const { setCurrentPanel, setCurrentSubPanel } = useDispatch('quillForms/builder-panels');

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

	const className = currentPanel && panelType === 'modal' ? 'builder-core-panel-modal' : 'builder-core-full-screen-panel';
	return (

		<div className={className} tabIndex={0} // Makes the div focusable
			onKeyDown={(e) => {
				if (e.key === 'Escape') {
					setCurrentPanel('');
				}
			}} >
			<div
				className={`builder-core-panel builder-core-${currentPanel?.name}-panel`}
			// exit on clicking escape

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
		</div >
	);
};
export default Panel;

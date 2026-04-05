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

interface PanelProps {
	isLogicRoute?: boolean;
}

const Panel: React.FC<PanelProps> = ({ isLogicRoute = false }) => {
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

	const isCalculatorFamilyOverlay =
		currentPanel?.name === 'calculator' ||
		currentPanel?.name === 'calculator-points' ||
		currentPanel?.name === 'calculator-variables';

	const elevateCalculatorModal =
		isLogicRoute &&
		isCalculatorFamilyOverlay &&
		panelType === 'modal';

	const className = classnames(
		currentPanel?.name === 'theme'
			? 'builder-core-inline-panel'
			: currentPanel && panelType === 'modal'
				? 'builder-core-panel-modal'
				: 'builder-core-full-screen-panel',
		elevateCalculatorModal && 'builder-core-panel-modal--above-jump-logic'
	);
	return (

		<div className={className} tabIndex={0} // Makes the div focusable
			onKeyDown={(e) => {
				if (e.key === 'Escape') {
					if (isCalculatorFamilyOverlay && isLogicRoute) {
						setCurrentPanel('jump-logic');
					} else {
						setCurrentPanel('');
					}
				}
			}} >
			<div
				className={`builder-core-panel builder-core-${currentPanel?.name}-panel`}
			// exit on clicking escape

			>
			    {/* <PanelHeader /> */}
				{currentPanel?.name !== 'jump-logic' && <PanelHeader />}
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

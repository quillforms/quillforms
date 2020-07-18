import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import PanelHeader from './header';
import SubPanel from './subpanel';
const Panel = () => {
	const { areaToHide, currentPanelObj, currentPanel } = useSelect(
		( select ) => {
			return {
				areaToHide: select(
					'quillForms/builder-panels'
				).getAreaToHide(),
				currentPanel: select(
					'quillForms/builder-panels'
				).getCurrentPanel(),
				currentPanelObj: select(
					'quillForms/builder-panels'
				).getCurrentPanelObj(),
			};
		}
	);

	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );

	useEffect( () => {
		// console.log(currentPanelObj);
		if (
			currentPanelObj.mode === 'parent' &&
			currentPanelObj.subPanels.length > 0
		) {
			setCurrentSubPanel( currentPanelObj.subPanels[ 0 ].name );
		} else {
			setCurrentSubPanel( '' );
		}
	}, [ currentPanel ] );

	return (
		<div
			className={ 'builder-core-panel' }
			style={ {
				width:
					areaToHide === 'drop-area' || areaToHide === 'preview-area'
						? '45%'
						: '300px',
			} }
		>
			{ <PanelHeader /> }
			{ currentPanelObj && (
				<div className="builder-core-panel__content">
					{ currentPanelObj.mode === 'single' ? (
						<currentPanelObj.render />
					) : (
						<SubPanel subPanels={ currentPanelObj.subPanels } />
					) }
				</div>
			) }
		</div>
	);
};
export default Panel;

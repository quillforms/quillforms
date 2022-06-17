/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { sortBy } from 'lodash';

/**
 * Internal Dependencies
 */
import PanelHeader from '../panel-header';
import SubPanel from '../subpanel';
const Panel = () => {
	const { areaToShow, currentPanel } = useSelect( ( select ) => {
		return {
			areaToShow: select( 'quillForms/builder-panels' ).getAreaToShow(),
			currentPanel: select(
				'quillForms/builder-panels'
			).getCurrentPanel(),
		};
	} );

	const { setCurrentSubPanel } = useDispatch( 'quillForms/builder-panels' );

	useEffect( () => {
		if (
			currentPanel?.mode === 'parent' &&
			currentPanel?.subPanels &&
			currentPanel?.subPanels?.length > 0
		) {
			setCurrentSubPanel(
				sortBy( currentPanel.subPanels, [ 'position' ] )[ 0 ].name
			);
		} else {
			setCurrentSubPanel( '' );
		}
	}, [ currentPanel ] );

	return (
		<div
			className={ 'builder-core-panel' }
			style={ {
				width:
					areaToShow === 'drop-area' || areaToShow == 'preview-area'
						? '45%'
						: areaToShow === 'no-area'
						? '100%'
						: '300px',
			} }
		>
			<PanelHeader />
			{ currentPanel && (
				<div className="builder-core-panel__content-wrapper">
					{ currentPanel.mode === 'single' ? (
						// @ts-expect-error
						<currentPanel.render />
					) : (
						<SubPanel />
					) }
				</div>
			) }
		</div>
	);
};
export default Panel;

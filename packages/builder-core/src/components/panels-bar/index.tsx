/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import NavItem from '../panel-item';

const BuilderPanelsBar = () => {
	const { currentPanelName, panels } = useSelect( ( select ) => {
		return {
			currentPanelName: select(
				'quillForms/builder-panels'
			).getCurrentPanelName(),
			panels: select( 'quillForms/builder-panels' ).getVisiblePanels(),
		};
	} );
	const { setCurrentPanel } = useDispatch( 'quillForms/builder-panels' );
	return (
		<div className="builder-core-builder-panels-bar">
			{ panels.map( ( panel ) => {
				const isSelected = panel.name === currentPanelName;
				return (
					<NavItem
						key={ panel.name }
						panel={ panel }
						isSelected={ isSelected }
						setCurrentPanel={ setCurrentPanel }
					/>
				);
			} ) }
			<div className="builder-core-panel-navbar__separator"></div>
		</div>
	);
};

export default BuilderPanelsBar;

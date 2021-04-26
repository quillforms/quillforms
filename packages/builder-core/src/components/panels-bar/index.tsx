/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

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
	return (
		<div className="builder-core-builder-panels-bar">
			{ panels.map( ( panel ) => {
				const isSelected = panel.name === currentPanelName;
				return (
					<NavItem
						key={ panel.name }
						panelName={ panel.name }
						isSelected={ isSelected }
					/>
				);
			} ) }
			<div className="builder-core-panel-navbar__separator"></div>
		</div>
	);
};

export default BuilderPanelsBar;

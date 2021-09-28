/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { sortBy } from 'lodash';
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
			{ sortBy( panels, [ 'position' ] ).map( ( panel, index ) => {
				const isSelected = panel.name === currentPanelName;
				return (
					<NavItem
						index={ index }
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

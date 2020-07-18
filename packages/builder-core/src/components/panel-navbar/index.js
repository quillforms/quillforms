/**
 * WordPress Core Dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import NavItem from './nav-item';
import Logo from './logo';

const PanelNavbar = ( props ) => {
	const { panels, currentPanel, setCurrentPanel } = props;
	return (
		<div className="builder-core-panel-navbar">
			<div className="builder-core-panel-navbar__logo">
				<Logo />
			</div>
			{ panels.map( ( panel ) => {
				const isSelected = panel.name === currentPanel;
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

export default compose( [
	withSelect( ( select ) => {
		const { getCurrentPanel, getVisiblePanels } = select(
			'quillForms/builder-panels'
		);

		return {
			panels: getVisiblePanels(),
			currentPanel: getCurrentPanel(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentPanel, setAreaToHide } = dispatch(
			'quillForms/builder-panels'
		);
		return {
			setCurrentPanel: ( panel ) => setCurrentPanel( panel ),
			setAreaToHide: ( areaToHide ) => setAreaToHide( areaToHide ),
		};
	} ),
] )( PanelNavbar );

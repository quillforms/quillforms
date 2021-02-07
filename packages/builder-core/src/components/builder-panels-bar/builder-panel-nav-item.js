/**
 * WordPress Dependencies
 */
import { Tooltip } from '@wordpress/components';

/**
External Dependencies
 */
import classnames from 'classnames';

const NavItem = ( { panel, setCurrentPanel, isSelected } ) => {
	return (
		<div
			className={ classnames( 'builder-core-builder-panel-nav-item', {
				active: isSelected ? true : false,
			} ) }
		>
			<Tooltip text={ panel.title } position="middle right">
				<div
					role="presentation"
					onClick={ () => {
						setCurrentPanel( panel.name );
					} }
					className="builder-core-builder-panel-nav-item__icon"
				>
					<panel.icon />
				</div>
			</Tooltip>
		</div>
	);
};

export default NavItem;

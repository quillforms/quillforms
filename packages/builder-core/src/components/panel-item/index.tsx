/**
 * WordPress Dependencies
 */
import { Tooltip, Icon } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 External Dependencies
  */
import classnames from 'classnames';

const NavItem = ( { panel, setCurrentPanel, isSelected } ) => {
	const icon = panel?.icon ? panel.icon : plus;
	const renderedIcon = <Icon icon={ icon && icon.src ? icon.src : icon } />;

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
					{ renderedIcon }
				</div>
			</Tooltip>
		</div>
	);
};

export default NavItem;

/**
 * QuillForms Dependencies
 */
import { Tooltip } from '@quillforms/builder-components';

/**
External Dependencies
 */
import classnames from 'classnames';

const NavItem = ( { panel, setCurrentPanel, isSelected } ) => {
	return (
		<div
			className={ classnames( 'builder-core-panel-navbar-item', {
				active: isSelected ? true : false,
			} ) }
		>
			<Tooltip title={ panel.title } placement="right" arrow>
				<div
					role="presentation"
					onClick={ () => {
						setCurrentPanel( panel.name );
					} }
					className="builder-core-panel-navbar-item__icon"
				>
					<panel.icon />
				</div>
			</Tooltip>
		</div>
	);
};

export default NavItem;

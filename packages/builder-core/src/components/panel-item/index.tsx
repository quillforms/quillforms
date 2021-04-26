/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, Icon as IconType } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { memo } from '@wordpress/element';
import { Tooltip, Icon, Dashicon } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 External Dependencies
  */
import classnames from 'classnames';

interface Props {
	panelName: string;
	isSelected: boolean;
}
const PanelNavItem: React.FC< Props > = memo( ( { panelName, isSelected } ) => {
	const { panel } = useSelect( ( select ) => {
		return {
			panel: select( 'quillForms/builder-panels' ).getPanelByName(
				panelName
			),
		};
	} );
	if ( ! panel ) return null;
	const icon = panel?.icon ? panel.icon : plus;

	const renderedIcon = (
		<Icon
			icon={
				( ( icon as IconDescriptor )?.src as IconType )
					? ( ( icon as IconDescriptor ).src as IconType )
					: ( icon as Dashicon.Icon )
			}
		/>
	);
	const { setCurrentPanel } = useDispatch( 'quillForms/builder-panels' );

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
} );

export default PanelNavItem;

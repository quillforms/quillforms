/**
 * QuillForms Dependencies
 */
import type { IconDescriptor, Icon as IconType } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { memo, useState, useEffect } from '@wordpress/element';
import { Tooltip, Icon, Dashicon } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 External Dependencies
  */
import classnames from 'classnames';
import { css } from 'emotion';

interface Props {
	panelName: string;
	isSelected: boolean;
	index: number;
}
const PanelNavItem: React.FC< Props > = memo(
	( { panelName, isSelected, index } ) => {
		const [ isMounted, setIsMounted ] = useState( false );

		useEffect( () => {
			setTimeout( () => {
				setIsMounted( true );
			}, 100 );
		}, [] );
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
				className={ classnames(
					'builder-core-builder-panel-nav-item',
					css`
						transform: scale( 0 );
						opacity: 0;
						transition: all 0.2s ease;
						transition-delay: ${ index * 0.1 }s;

						&.mounted {
							transform: scale( 1 );
							opacity: 1;
						}
					`,
					{
						active: isSelected ? true : false,
						mounted: isMounted,
					}
				) }
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
	}
);

export default PanelNavItem;

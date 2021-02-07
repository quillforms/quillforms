import { registerBuilderPanel, registerBuilderSubPanel } from '../api';
import { omit } from 'lodash';

// Panels
import { panelSettings as Blocks } from './blocks';
import { panelSettings as BlockControls } from './block-controls';
import { panelSettings as Notifications } from './notifications';
import { panelSettings as Settings } from './settings';
import { panelSettings as Theme } from './theme';

// Sub Panels
import { subpanelSettings as Messages } from './settings/subpanels/messages';
import { subpanelSettings as Document } from './settings/subpanels/document';
import { subpanelSettings as MyThemes } from './theme/subpanels/my-themes';
import { subpanelSettings as CustomizeTheme } from './theme/subpanels/customize';

export const registerPanels = () => {
	// Register Panels
	[ Blocks, Notifications, BlockControls, Theme, Settings ].forEach(
		( panel ) => {
			registerBuilderPanel( panel.name, {
				...omit( panel, [ 'name' ] ),
			} );
		}
	);

	// Register Subpanels
	[ Document, Messages, MyThemes, CustomizeTheme ].forEach( ( subpanel ) => {
		registerBuilderSubPanel( subpanel.name, {
			...omit( subpanel, [ 'name' ] ),
		} );
	} );
};

import { registerBuilderPanel, registerBuilderSubPanel } from '../api';
import omit from 'lodash/omit';

// Panels
import { panelSettings as Blocks } from './blocks';
import { panelSettings as BlockControls } from './block-controls';
import { panelSettings as Notifications } from './notifications';
import { panelSettings as Settings } from './settings';

// Sub Panels
import { subpanelSettings as SelfNotifications } from './notifications/subpanels/self';
import { subpanelSettings as Messages } from './settings/subpanels/messages';

export const registerPanels = () => {
	// Register Panels
	[ Blocks, Notifications, BlockControls, Settings ].forEach( ( panel ) => {
		registerBuilderPanel( panel.name, {
			...omit( panel, [ 'name' ] ),
		} );
	} );

	// Register Subpanels
	[ SelfNotifications, Messages ].forEach( ( subpanel ) => {
		registerBuilderSubPanel( subpanel.name, {
			...omit( subpanel, [ 'name' ] ),
		} );
	} );
};

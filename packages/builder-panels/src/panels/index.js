import { registerBuilderPanel, registerBuilderSubPanel } from '../api';
import omit from 'lodash/omit';

// Panels
import { panelSettings as Blocks } from './blocks';
import { panelSettings as BlockControls } from './block-controls';
import { panelSettings as Notifications } from './notifications';
import { panelSettings as Settings } from './settings';

// Sub Panels
import { subpanelSettings as Messages } from './settings/subpanels/messages';
import { subpanelSettings as Document } from './settings/subpanels/document';

export const registerPanels = () => {
	// Register Panels
	[ Blocks, Notifications, BlockControls, Settings ].forEach( ( panel ) => {
		registerBuilderPanel( panel.name, {
			...omit( panel, [ 'name' ] ),
		} );
	} );

	// Register Subpanels
	[ Document, Messages ].forEach( ( subpanel ) => {
		registerBuilderSubPanel( subpanel.name, {
			...omit( subpanel, [ 'name' ] ),
		} );
	} );
};

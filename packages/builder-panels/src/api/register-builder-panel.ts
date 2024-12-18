/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * QuillForms Dependencies
 */
import { isValidIcon, normalizeIconObject } from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { select, dispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { isFunction, pick, some } from 'lodash';

/**
 * Internal Dependencies
 */
import type { PanelSettings } from '../types';

/**
 * Register Builder Panel
 *
 * @param {string} name     Panel unique name.
 * @param {Object} settings Panel settings.
 *
 */
export const registerBuilderPanel = (
	name: string,
	settings: PanelSettings
): PanelSettings | undefined => {
	settings = applyFilters(
		'QuillForms.BuilderPanels.PanelSettings',
		settings,
		name
	) as PanelSettings;

	if (typeof name !== 'string') {
		console.error('Builder panel "name" must be string.');
		return;
	}

	if (typeof settings.type !== 'string') {
		settings.type = 'modal';
	}



	const panels = select('quillForms/builder-panels').getPanels();
	if (some(panels, (panel) => panel.name === name)) {
		console.error(`The panel ${name} is already registered`);
		return;
	}

	if (!settings.title) {
		console.error("The 'title' property must be passed");
		return;
	}

	if (typeof settings.title !== 'string') {
		console.error('Builder panel "title" must be string.');
		return;
	}

	if (settings.isHidden && typeof settings.isHidden !== 'boolean') {
		console.error('The "isHidden" property must be boolean');
		return;
	}

	if (
		settings.position &&
		typeof settings.position !== 'number' &&
		!settings.isHidden
	) {
		console.error('The "position" property must be a number');
		return;
	}

	if (settings.position !== 0 && !settings.position) {
		// Default position
		settings.position = 10;
	}


	settings.icon = normalizeIconObject(settings.icon);

	if (!isValidIcon(settings.icon.src)) {
		console.error('The "icon" property must be a valid function!');
		return;
	}

	if (settings.mode !== 'parent') {
		settings.mode = 'single';
	}
	if (settings.mode === 'single' && !settings.render) {
		console.error(
			'The "render" property should be defined in case of single panels'
		);
		return;
	}

	if (settings.render && !isFunction(settings.render)) {
		console.error("The 'render' property must be a valid function");
		return;
	}

	settings = pick(settings, [
		'icon',
		'title',
		'render',
		'isHidden',
		'mode',
		'position',
		'type'
	]);

	dispatch('quillForms/builder-panels').registerBuilderPanel(
		name,
		settings
	);
	return settings;
};

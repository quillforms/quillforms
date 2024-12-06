/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
/**
 * WordPress Dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * External Dependencies
 */
import { isFunction, pick } from 'lodash';

/**
 * Internal Dependencies
 */
import { isValidIcon, normalizeIconObject } from '@quillforms/utils';
import { BlockAdminSettings } from '../types';


const blockColors = {
	'welcome-screen': '#FFD8D8',      // Softer coral pink (calm and warm)
	'date': '#BFEDEC',               // Softer turquoise (calm and fresh)
	'email': '#B3E7F6',              // Lighter ocean blue (calm and clean)
	'dropdown': '#D8EFE5',           // Softer sage green (light and natural)
	'multiple-choice': '#E4DFF3',    // Lighter pastel purple (calm and friendly)
	'statement': '#FFF3D1',          // Softer pale yellow (warm and calming)
	'website': '#C4DBF7',            // Softer light sky blue (friendly and calm)
	'short-text': '#CCF2E0',         // Soft mint green (calm and refreshing)
	'long-text': '#DAEAFE',          // Softer pastel blue (soft and clean)
	'thankyou-screen': '#FFDFDF',    // Lighter soft pink (friendly and calm)
	'group': '#F5E6FF',              // Light lavender (calm and soothing)
	'opinion-scale': '#D4D2E0',      // Lighter dusty purple (calm and neutral)
	'slider': '#FFDADB',             // Softer coral pink (warm and fresh)
	'picture-choice': '#D8E3FB',     // Lighter periwinkle blue (calm and serene)
	'rating': '#FFE0CC',             // Lighter light salmon (calm and inviting)
	'phone': '#E8FAF4',              // Softer mint cream (fresh and soft)
	'input-mask': '#EDEAF9',         // Lighter lavender blue (calm and soft)
	'matrix': '#E5F6FF',             // Soft sky blue (calm and clean)
	'number': '#FBE4D5',             // Light peach (calm and inviting)
	'file': '#FEE7E1',               // Soft pastel peach (calm and warm)
	'image-upload': '#DFF6EE',       // Soft pastel green (natural and refreshing)
	'partial-submission-point': '#E3F1FF', // Light pastel blue (calm and fresh)
};

/**
 * Set block admin settings.
 * Block admin settings is the configuration for the block that should be loaded at the admin only.
 * We should define here the block icon, controls, color and logic control.
 *
 * @param {string}             name       Block name.
 * @param {BlockAdminSettings} settings   Block configuration.
 *
 */
export const setBlockAdminSettings = (
	name: string,
	settings: BlockAdminSettings
): BlockAdminSettings | void => {
	settings = {
		title: 'Untitled',
		color: '#333s',
		icon: 'plus',
		order: 20,
		controls: () => null,
		...settings,
	};

	if (typeof name !== 'string') {
		console.error('Block types must be strings.');
		return;
	}

	const blockType = select('quillForms/blocks').getBlockType(name);
	if (!blockType) {
		console.error(
			`The ${name} block isn't registered. Please register it first!`
		);
		return;
	}

	if (typeof settings.color !== 'string') {
		console.error('The "color" property must be a valid string!');
	}

	settings.icon = normalizeIconObject(settings.icon);

	if (!isValidIcon(settings.icon.src)) {
		console.error('The "icon" property must be a valid function!');
		return;
	}

	if (settings.logicControl && !isFunction(settings.logicControl)) {
		console.error(
			'The "logicControl" property must be a valid function!'
		);
		return;
	}

	if (settings.entryDetails && !isFunction(settings.entryDetails)) {
		console.error(
			'The "entryDetails" property must be a valid function!'
		);
		return;
	}

	if (!isFunction(settings.controls)) {
		console.error('The "controls" property must be a valid function!');
		return;
	}

	if (settings.order && isNaN(settings.order)) {
		console.error('The "order" property must be a valid number!');
		return;
	}

	if (!isFunction(settings.getChoices)) {
		// @ts-ignore
		settings.getChoices = ({ id, attributes }) => {
			return [];
		};
	}
	if (blockColors[name]) {
		console.log('setting color');
		settings.color = blockColors[name];
	}

	dispatch('quillForms/blocks').setBlockAdminSettings(
		pick(settings, [
			'controls',
			'entryDetails',
			'logicControl',
			'color',
			'icon',
			'title',
			'order',
			'getChoices',
		]),
		name
	);
};

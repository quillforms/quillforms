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
import OpinionScaleIcon from '../icons/opinion-scale';
import PictureChoiceIcon from '../icons/picture-choice';
import FileUploadIcon from '../icons/file-upload';
import PhoneIcon from '../icons/phone';


// export const blockColors = {
// 	'welcome-screen': '#FFD8D8',      // Softer coral pink (calm and warm)
// 	'date': '#BFEDEC',               // Softer turquoise (calm and fresh)
// 	'email': '#B3E7F6',              // Lighter ocean blue (calm and clean)
// 	'dropdown': '#D8EFE5',           // Softer sage green (light and natural)
// 	'multiple-choice': '#E4DFF3',    // Lighter pastel purple (calm and friendly)
// 	'statement': '#FFF3D1',          // Softer pale yellow (warm and calming)
// 	'website': '#C4DBF7',            // Softer light sky blue (friendly and calm)
// 	'short-text': '#CCF2E0',         // Soft mint green (calm and refreshing)
// 	'long-text': '#DAEAFE',          // Softer pastel blue (soft and clean)
// 	'thankyou-screen': '#FFDFDF',    // Lighter soft pink (friendly and calm)
// 	'group': '#F5E6FF',              // Light lavender (calm and soothing)
// 	'opinion-scale': '#D4D2E0',      // Lighter dusty purple (calm and neutral)
// 	'slider': '#FFDADB',             // Softer coral pink (warm and fresh)
// 	'picture-choice': '#D8E3FB',     // Lighter periwinkle blue (calm and serene)
// 	'rating': '#FFE0CC',             // Lighter light salmon (calm and inviting)
// 	'phone': '#E8FAF4',              // Softer mint cream (fresh and soft)
// 	'input-mask': '#EDEAF9',         // Lighter lavender blue (calm and soft)
// 	'matrix': '#E5F6FF',             // Soft sky blue (calm and clean)
// 	'cal.com': '#fff',               // White
// 	'number': '#FBE4D5',             // Light peach (calm and inviting)
// 	'file': '#FEE7E1',               // Soft pastel peach (calm and warm)
// 	'image-upload': '#DFF6EE',       // Soft pastel green (natural and refreshing)
// 	'partial-submission-point': '#ff9e7e', // Light pastel blue (calm and fresh)
// 	"signature": "#E8F8F5",          // Light pastel green (calm and fresh)
// 	"calendar-picker": "#E8F8F5",    // Light lavender (calm and soothing)
// 	'legal': '#FEE7E1',              // Soft pastel peach (calm and warm)
// };

export const blockColors = {
	// Custom colors for specific blocks
	'welcome-screen': '#FFD8D8',      // Softer coral pink (calm and warm)
	'thankyou-screen': '#FFDFDF',    // Lighter soft pink (friendly and calm)
	'group': '#FBE4D5',              // Light lavender (calm and soothing)
	'partial-submission-point': '#FF9E7E', // Light pastel orange (calm and fresh)

	// Uniform color for all other fields
	'date': '#E4DFF3',               // Soft neutral beige (calm and clean)
	'email': '#E4DFF3',              // Soft neutral beige (calm and clean)
	'dropdown': '#E4DFF3',           // Soft neutral beige (calm and clean)
	'multiple-choice': '#E4DFF3',    // Soft neutral beige (calm and clean)
	'statement': '#E4DFF3',          // Soft neutral beige (calm and clean)
	'website': '#E4DFF3',            // Soft neutral beige (calm and clean)
	'short-text': '#E4DFF3',         // Soft neutral beige (calm and clean)
	'long-text': '#E4DFF3',          // Soft neutral beige (calm and clean)
	'opinion-scale': '#E4DFF3',      // Soft neutral beige (calm and clean)
	'slider': '#E4DFF3',             // Soft neutral beige (calm and clean)
	'picture-choice': '#E4DFF3',     // Soft neutral beige (calm and clean)
	'rating': '#E4DFF3',             // Soft neutral beige (calm and clean)
	'phone': '#E4DFF3',              // Soft neutral beige (calm and clean)
	'input-mask': '#E4DFF3',         // Soft neutral beige (calm and clean)
	'matrix': '#E4DFF3',             // Soft neutral beige (calm and clean)
	'cal.com': '#E4DFF3',            // Soft neutral beige (calm and clean)
	'number': '#E4DFF3',             // Soft neutral beige (calm and clean)
	'file': '#E4DFF3',               // Soft neutral beige (calm and clean)
	'image-upload': '#E4DFF3',       // Soft neutral beige (calm and clean)
	'signature': '#E4DFF3',          // Soft neutral beige (calm and clean)
	'calendar-picker': '#E4DFF3',    // Soft neutral beige (calm and clean)
	'legal': '#E4DFF3',              // Soft neutral beige (calm and clean)
	'address': '#E4DFF3', // Soft neutral beige (calm and clean)
};

// const blockColors = {
// 	'welcome-screen': '#F5D8DB',      // Cool coral pink
// 	'date': '#B8E5E4',               // Cool turquoise
// 	'email': '#B8E1ED',              // Cool ocean blue
// 	'dropdown': '#CBE5DB',           // Cool sage
// 	'multiple-choice': '#DFD8E8',    // Cool pastel purple
// 	'statement': '#F2EBD8',          // Cool cream
// 	'website': '#C4DBF0',            // Cool sky blue
// 	'short-text': '#C2E8D8',         // Cool mint
// 	'long-text': '#D3E2F5',          // Cool pastel blue
// 	'thankyou-screen': '#F5D8E1',    // Cool pink
// 	'group': '#E8D8F0',              // Cool lavender
// 	'opinion-scale': '#D8D8E5',      // Cool dusty purple
// 	'slider': '#F5D8DE',             // Cool rose
// 	'picture-choice': '#D3DEF2',     // Cool periwinkle
// 	'rating': '#F2DCD3',             // Cool salmon
// 	'phone': '#D8EBE5',              // Cool mint cream
// 	'input-mask': '#E2D8F0',         // Cool lavender blue
// 	'matrix': '#D8E5F2',             // Cool sky blue
// 	'number': '#EBD8D3',             // Cool peach
// 	'file': '#F0DCD8',               // Cool pastel peach
// 	'image-upload': '#D3E8E2',       // Cool pastel green
// 	'partial-submission-point': '#D8E5F0', // Cool pastel blue
// 	'signature': '#D8E8E5',          // Cool pastel green
// 	'calendar-picker': '#D8E2E8',    // Cool blue grey
// 	'legal': '#EBD8D3'               // Cool peach
// };
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

	if (name === 'opinion-scale') {
		settings.icon = OpinionScaleIcon;
	}
	if (name === 'picture-choice') {
		settings.icon = PictureChoiceIcon;
	}

	if (name === 'file') {
		settings.icon = FileUploadIcon;
	}

	if (name === 'phone') {
		settings.icon = PhoneIcon;
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
		//console.log('setting color');
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

/**
 * External Dependencies
 */
import DateIcon from '@material-ui/icons/Event';

/**
 * Internal Dependencies
 */
import output from './output';
import controls from './controls';
import metadata from './block.json';

const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#93AE89',
		icon: DateIcon,
		controls,
	},
	rendererConfig: {
		output,
		// eslint-disable-next-line no-unused-vars
		hasSubmitBtn: ( args ) => {
			return true;
		},
	},
};

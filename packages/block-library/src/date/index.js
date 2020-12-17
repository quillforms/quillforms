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
import logicControl from './logic-control';

const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#93AE89',
		icon: DateIcon,
		controls,
		logicControl,
	},
	rendererConfig: {
		output,
	},
};

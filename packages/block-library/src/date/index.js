import output from './output';
import controls from './controls';
import DateIcon from '@material-ui/icons/Event';

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
	},
};

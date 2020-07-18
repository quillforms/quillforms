import output from './output';
import controls from './controls';
import ShortTextIcon from '@material-ui/icons/ShortText';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#709a2d',
		icon: ShortTextIcon,
		controls,
	},
	rendererConfig: {
		output,
	},
};

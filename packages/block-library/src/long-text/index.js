import output from './output';
import controls from './controls';
import longTextIcon from '@material-ui/icons/Subject';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#A086C4',
		icon: longTextIcon,
		controls,
	},
	rendererConfig: {
		output,
	},
};

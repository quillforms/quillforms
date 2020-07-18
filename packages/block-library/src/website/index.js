import output from './output';
import LinkIcon from '@material-ui/icons/Link';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#6b4646',
		icon: LinkIcon,
	},
	rendererConfig: {
		output,
	},
};

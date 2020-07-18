import output from './output';
import EmailIcon from '@material-ui/icons/Email';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#27aec3',
		icon: EmailIcon,
	},
	rendererConfig: {
		output,
	},
};

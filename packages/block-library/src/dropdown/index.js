import output from './output';
import controls from './controls';
import DnsIcon from '@material-ui/icons/Dns';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#bf2f2f',
		icon: DnsIcon,
		controls,
	},
	rendererConfig: {
		output,
		getRawValue: ( value ) => {
			return value.label;
		},
	},
};

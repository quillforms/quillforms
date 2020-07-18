import output from './output';
import controls from './controls';
import CheckIcon from '@material-ui/icons/Check';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#9e5210',
		icon: CheckIcon,
		controls,
	},
	rendererConfig: {
		output,
		getRawValue: ( val ) =>
			val.map( ( choice ) => choice.label ).join( ', ' ),
	},
};

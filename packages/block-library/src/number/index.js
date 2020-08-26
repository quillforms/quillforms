import output from './output';
import controls from './controls';
import NumberIcon from './icon';
import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#127fa9',
		icon: NumberIcon,
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

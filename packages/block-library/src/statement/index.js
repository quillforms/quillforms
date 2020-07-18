import output from './output';
import controls from './controls';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';

import metadata from './block.json';
const { type } = metadata;

export { type, metadata };

export const settings = {
	editorConfig: {
		color: '#ad468d',
		icon: FormatQuoteIcon,
		controls,
	},
	rendererConfig: {
		output,
	},
};

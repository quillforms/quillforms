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
		getCounterContent: ( args ) => {
			const {
				attributes: { quotationMarks },
			} = args;
			if ( quotationMarks ) {
				return 'quote';
			}
			return null;
		},
		// eslint-disable-next-line no-unused-vars
		hasSubmitBtn: ( args ) => {
			return true;
		},
		getSubmitBtnTxt: ( args ) => {
			const {
				attributes: { buttonText },
			} = args;

			return buttonText;
		},
	},
};

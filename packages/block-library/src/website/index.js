/* eslint-disable no-unused-vars */

/**
 * External Dependencies
 */
import LinkIcon from '@material-ui/icons/Link';

/**
 * Internal Dependencies
 */
import output from './output';
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
		hasSubmitBtn: ( args ) => {
			return true;
		},
	},
};

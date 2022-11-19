import { registerBlockType } from '@quillforms/blocks';
import { name, metadata } from '@quillforms/blocklib-number-block';
// eslint-disable-next-line no-restricted-syntax
import rendererSettings from '@quillforms/blocklib-number-block/build/renderer/settings';

const register = () => {
	registerBlockType( name, {
		...metadata,
		...rendererSettings,
	} );
};
export default register;

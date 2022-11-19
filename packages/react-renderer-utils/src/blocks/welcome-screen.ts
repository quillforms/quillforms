import { registerBlockType } from '@quillforms/blocks';
import { name, metadata } from '@quillforms/blocklib-welcome-screen-block';
// eslint-disable-next-line no-restricted-syntax
import rendererSettings from '@quillforms/blocklib-welcome-screen-block/build/renderer/settings';

const register = () => {
	registerBlockType( name, {
		...metadata,
		...rendererSettings,
	} );
};
export default register;

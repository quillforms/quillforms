import { registerBlockType } from '@quillforms/blocks';
import { name, metadata } from '@quillforms/blocklib-multiple-choice-block';
// eslint-disable-next-line no-restricted-syntax
import rendererSettings from '@quillforms/blocklib-multiple-choice-block/build/renderer/settings';
const register = () => {
	registerBlockType( name, {
		...metadata,
		...rendererSettings,
	} );
};
export default register;

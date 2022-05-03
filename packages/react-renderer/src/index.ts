import '@quillforms/renderer-core/build-style/style.css';
import '@quillforms/renderer-core';
import '@quillforms/blocks';
import { register } from '@wordpress/data';
import { store as blocksStore } from '@quillforms/blocks';
import { store as rendererStore } from '@quillforms/renderer-core';
export { default as registerCoreBlocks } from './register-blocks';
export { Form } from '@quillforms/renderer-core';

export const registerStores = () => {
	register( blocksStore );
	register( rendererStore );
};

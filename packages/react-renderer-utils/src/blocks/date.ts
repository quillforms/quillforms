import { registerBlockType } from '@quillforms/blocks';
import {
	name,
	metadata,
	rendererSettings,
} from '@quillforms/blocklib-date-block';

const register = () => {
	registerBlockType( name, {
		...metadata,
		...rendererSettings,
	} );
};
export default register;

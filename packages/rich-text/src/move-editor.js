import { Transforms } from 'slate';

const moveEditor = ( editor, options = {} ) => {
	Transforms.move( editor, {} );
};
export default moveEditor;

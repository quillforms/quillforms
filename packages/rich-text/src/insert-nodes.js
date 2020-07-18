import { Transforms } from 'slate';
const insertNodes = ( editor, nodes, options ) => {
	Transforms.insertNodes( editor, nodes, options );
};

export default insertNodes;

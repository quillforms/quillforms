import { Transforms } from 'slate';
export const insertText = ( editor, text, options ) => {
	Transforms.insertText( editor, text, options );
};

export default insertText;

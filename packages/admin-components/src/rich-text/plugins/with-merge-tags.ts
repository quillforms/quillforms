import { Editor } from 'slate';

export const withMergeTags = ( editor: Editor ) => {
	const { isInline, isVoid } = editor;

	editor.isInline = ( element ) => {
		return element.type === 'mergeTag' ? true : isInline( element );
	};

	editor.isVoid = ( element ) => {
		return element.type === 'mergeTag' ? true : isVoid( element );
	};

	return editor;
};

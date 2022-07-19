import { CustomEditor, CustomElement } from '../types';

export const withMergeTags = ( editor: CustomEditor ) => {
	const { isInline, isVoid } = editor;

	editor.isInline = ( element: CustomElement ) => {
		return element.type === 'mergeTag' ? true : isInline( element );
	};

	editor.isVoid = ( element: CustomElement ) => {
		return element.type === 'mergeTag' ? true : isVoid( element );
	};

	return editor;
};

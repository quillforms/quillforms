export const withMergeTags = ( editor ) => {
	const { isInline, isVoid } = editor;

	editor.isInline = ( element ) => {
		return element.type === 'mergeTag' ? true : isInline( element );
	};

	editor.isVoid = ( element ) => {
		return element.type === 'mergeTag' ? true : isVoid( element );
	};

	return editor;
};

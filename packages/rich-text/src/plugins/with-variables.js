export const withVariables = ( editor ) => {
	const { isInline, isVoid } = editor;

	editor.isInline = ( element ) => {
		return element.type === 'variable' ? true : isInline( element );
	};

	editor.isVoid = ( element ) => {
		return element.type === 'variable' ? true : isVoid( element );
	};

	return editor;
};

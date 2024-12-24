export const withLineBreaks = (editor) => {
    const { isInline, isVoid } = editor;

    // Define `lineBreak` as an inline element
    editor.isInline = (element) => {
        return element.type === 'lineBreak' ? true : isInline(element);
    };

    // Define `lineBreak` as a void element
    editor.isVoid = (element) => {
        return element.type === 'lineBreak' ? true : isVoid(element);
    };

    return editor;
};
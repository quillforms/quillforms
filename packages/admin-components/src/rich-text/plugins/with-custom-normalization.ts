import { Node } from 'slate';
export const withCustomNormalization = (editor) => {
    const { normalizeNode } = editor;

    editor.normalizeNode = ([node, path]) => {
        const isEmptyParagraph = (n) =>
            n.type === 'paragraph' && n.children.length === 1 && n.children[0].text === '';

        // Ensure consecutive empty paragraphs are preserved
        if (node.type === 'paragraph') {
            const parent = Node.parent(editor, path); // Get the parent node

            if (parent) {
                const index = path[path.length - 1]; // Current node index in parent
                const prevSibling = parent.children[index - 1];
                const nextSibling = parent.children[index + 1];

                // If this is an empty paragraph and the previous or next sibling is also empty, do nothing
                if (
                    isEmptyParagraph(node) &&
                    ((prevSibling && isEmptyParagraph(prevSibling)) ||
                        (nextSibling && isEmptyParagraph(nextSibling)))
                ) {
                    return; // Skip normalization for consecutive empty paragraphs
                }
            }
        }

        // Delegate to the original normalization logic
        normalizeNode([node, path]);
    };

    return editor;
};
import { useSelect, useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { Editor, Transforms } from 'slate';
import { useState, useMemo, useEffect, useCallback, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * QuillForms Dependencies
 */
import {
    __experimentalEditor as TextEditor,
    __unstableHtmlSerialize as serialize,
    __unstableReactEditor as ReactEditor,
    __unstableCreateEditor as createEditor,
    __unstableHtmlDeserialize as deserialize,
} from '@quillforms/admin-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classNames from 'classnames';

/**
 * BlockEditor Component
 */
const BlockEditor = ({ type, childId, childIndex, parentId }: { type: "label" | "description"; parentId?: string, childId?: string; childIndex: number }) => {
    // Selectors and Dispatch
    const { currentBlock, isAnimating, currentChildBlockId } = useSelect((select) => ({
        currentBlock: select("quillForms/block-editor").getCurrentBlock(),
        isAnimating: select("quillForms/renderer-core").isAnimating(),
        currentChildBlockId: select("quillForms/block-editor").getCurrentChildBlockId(),
    }));

    const lastFocusedRef = useRef<boolean>(false);



    const [isFocused, setIsFocused] = useState(false);


    const { prevFields, correctIncorrectQuiz, blockTypes } = useSelect((select) => {
        return {
            blockTypes: select('quillForms/blocks').getBlockTypes(),
            prevFields: select('quillForms/block-editor').getPreviousEditableFieldsWithOrder(currentBlock?.id),
            correctIncorrectQuiz: select('quillForms/quiz-editor').getState(),
        };
    });



    const { setBlockAttributes } = useDispatch("quillForms/block-editor");

    // Destructure current block attributes
    let { attributes, id } = currentBlock || {};
    let isChildBlock = false;

    if (
        type === "label" &&
        childIndex !== undefined &&
        childIndex > -1 &&
        currentBlock?.innerBlocks?.[childIndex]
    ) {
        attributes = currentBlock.innerBlocks[childIndex].attributes;
        id = currentBlock.innerBlocks[childIndex].id;
        isChildBlock = true; // Mark as child block for labels
    }

    const label = attributes?.label || "";
    const description = attributes?.description || "";

    // Dynamically Initialize Editor and State Based on Type
    const editor = useMemo(() => createEditor(), []); // Single editor instance for both label and description
    const [editorValue, setEditorValue] = useState(() => {
        if (type === "label") {
            return deserialize(isChildBlock ? attributes?.label || "" : label);
        }
        if (type === "description") {
            return deserialize((description)); // Always use parent description
        }
        return [];
    });

    // Handle focus state changes
    useEffect(() => {
        const editorNode = ReactEditor.toDOMNode(editor, editor);

        const handleEditorFocus = () => {
            lastFocusedRef.current = true;
        };

        const handleEditorBlur = () => {
            lastFocusedRef.current = false;
        };

        editorNode.addEventListener('focusin', handleEditorFocus);
        editorNode.addEventListener('focusout', handleEditorBlur);

        return () => {
            editorNode.removeEventListener('focusin', handleEditorFocus);
            editorNode.removeEventListener('focusout', handleEditorBlur);
        };
    }, [editor])

    // Update Editor Value When `type` or Attributes Change
    useEffect(() => {
        if (type === "label") {
            setEditorValue(deserialize(isChildBlock ? attributes?.label || "" : label));
        } else if (type === "description") {
            setEditorValue(deserialize((description))); // Always use parent description
        }
    }, [attributes, type, childIndex]);



    useEffect(() => {
        let timeoutId;

        if (!isAnimating && type === "label") {
            if (currentChildBlockId === childId || (!isChildBlock && !currentChildBlockId)) {
                timeoutId = setTimeout(() => {
                    const editorEl = ReactEditor.toDOMNode(editor, editor);
                    const rect = editorEl.getBoundingClientRect();
                    const isInViewport = (
                        rect.top >= 0 &&
                        rect.left >= 0 &&
                        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
                    );

                    if (!isInViewport) {
                        editorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    } else {
                        // ReactEditor.focus(editor);
                        // // Only set cursor to end if there's no existing selection
                        // if (!editor.selection) {
                        //     const point = Editor.end(editor, []);
                        //     Transforms.select(editor, point);
                        // }
                    }
                }, 100);
            }
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isAnimating, currentChildBlockId]);
    // Handle Editor Change
    const handleEditorChange = (value: CustomNode[]) => {
        if (JSON.stringify(value) !== JSON.stringify(editorValue)) {
            //console.log('value:', value);
            setEditorValue(value);
            const serizlizedValue = serialize(value);
            //console.log('serizlizedValue:', serizlizedValue);
            if (type === "label") {
                if (isChildBlock) {
                    setBlockAttributes(childId, { label: serizlizedValue }, parentId); // Update child block label
                } else {
                    setBlockAttributes(id, { label: serizlizedValue }); // Update parent block label
                }
            } else if (type === "description") {
                setBlockAttributes(id, { description: serizlizedValue }); // Always update parent block description
            }
        }
    };

    const editorRef = useRef(null);

    const handleFocus = useCallback(() => {
        if (!ReactEditor.isFocused(editor)) {
            ReactEditor.focus(editor);

            // // Only move cursor to end if there's no existing selection
            // if (!editor.selection) {
            //     const point = Editor.end(editor, []);
            //     Transforms.select(editor, point);
            // }
        }
    }, [editor]);


    // Styling
    const editorStyle = css`
        p {
            color: inherit !important;
            font-family: inherit !important;
            margin: 0;
            @media (min-width: 768px) {
                font-size: inherit !important;
                line-height: inherit !important;
            }
            @media (max-width: 767px) {
                font-size: inherit !important;
                line-height: inherit !important;
            }
        }
       
    `;
    const descriptionStyle = css`
        p {
            color: inherit !important;
            font-family: inherit !important;
            @media (min-width: 768px) {
                font-size: inherit !important;
                line-height: inherit !important;
            }
            @media (max-width: 767px) {
                font-size: inherit !important;
                line-height: inherit !important;
            }
        }
    `;
    let mergeTags = prevFields.map((field) => {
        return {
            type: 'field',
            label: field?.attributes?.label,
            modifier: field.id,
            icon: blockTypes[field.name]?.icon,
            color: blockTypes[field.name]?.color,
            order: field.order,
        };
    });
    mergeTags = mergeTags.concat(
        applyFilters('QuillForms.Builder.MergeTags', []) as any[]
    );

    if (correctIncorrectQuiz?.enabled) {
        mergeTags = mergeTags.concat([
            {
                type: 'quiz',
                label: 'Correct Answers Count',
                modifier: 'correct_answers_count',
                icon: 'yes',
                color: '#4caf50',
                order: undefined,
            },
            {
                type: 'quiz',
                label: 'Incorrect Answers Count',
                modifier: 'incorrect_answers_count',
                icon: 'no-alt',
                color: '#f44336',
                order: undefined,
            },
            {
                type: 'quiz',
                label: 'Quiz Summary',
                modifier: 'summary',
                icon: 'editor-table',
                color: '#4caf50',
                order: undefined,
            }
        ]);
    }

    // Add wrapper styles
    const wrapperStyles = css`
        &.block-editor-block-edit-label__editor:not(.is-focused) {
            [data-slate-placeholder="true"] {
                color: #757575 !important; // Customize this color as needed
                opacity: 0.87 !important; // Customize this opacity as needed
            }
        }

        // Ensure proper layering of placeholder and content
        .richtext__editor {
            position: relative;
        }

        [contenteditable] {
            position: relative;
            z-index: 1;
        }
    `;
    return (
        <div className={classNames(
            "block-editor-block-edit__editor",
            `block-editor-block-edit-${type}__editor`,
            { 'is-focused': isFocused },
            wrapperStyles
        )}
            onBlur={() => {
                setIsFocused(false);
            }}
            onClick={handleFocus}

            ref={editorRef}
        >
            <TextEditor
                editor={editor}
                placeholder={type === "label" ? __("Type question here. Recall information with @.", "quillforms") : __("Add a description", "quillforms")}
                className={type === "label" ? editorStyle : descriptionStyle}
                mergeTags={mergeTags}
                value={editorValue}
                onFocus={handleFocus}

                onChange={handleEditorChange}
                allowedFormats={["bold", "italic", "link", "color"]}
            />
        </div >
    );
};

export default BlockEditor;

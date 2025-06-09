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
 * Custom hook for debounced updates
 */
const useDebounce = (callback: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const debouncedCallback = useCallback((...args: any[]) => {
        // Clear the previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    }, [callback, delay]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Function to immediately execute pending updates
    const flush = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    return { debouncedCallback, flush };
};

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
        isChildBlock = true;
    }

    const label = attributes?.label || "";
    const description = attributes?.description || "";

    // Editor instance
    const editor = useMemo(() => createEditor(), []);

    // Local editor value for immediate UI updates
    const [editorValue, setEditorValue] = useState(() => {
        if (type === "label") {
            return deserialize(isChildBlock ? attributes?.label || "" : label);
        }
        if (type === "description") {
            return deserialize(description);
        }
        return [];
    });

    // Debounced update function
    const updateBlockAttributes = useCallback((serializedValue: string) => {
        if (type === "label") {
            if (isChildBlock) {
                setBlockAttributes(childId, { label: serializedValue }, parentId);
            } else {
                setBlockAttributes(id, { label: serializedValue });
            }
        } else if (type === "description") {
            setBlockAttributes(id, { description: serializedValue });
        }
    }, [type, isChildBlock, childId, parentId, id, setBlockAttributes]);

    // Create debounced version with 300ms delay
    const { debouncedCallback: debouncedUpdate, flush } = useDebounce(updateBlockAttributes, 0);

    // Handle focus state changes
    useEffect(() => {
        const editorNode = ReactEditor.toDOMNode(editor, editor);

        const handleEditorFocus = () => {
            lastFocusedRef.current = true;
        };

        const handleEditorBlur = () => {
            lastFocusedRef.current = false;
            // Flush any pending updates when user leaves the editor
            flush();
        };

        editorNode.addEventListener('focusin', handleEditorFocus);
        editorNode.addEventListener('focusout', handleEditorBlur);

        return () => {
            editorNode.removeEventListener('focusin', handleEditorFocus);
            editorNode.removeEventListener('focusout', handleEditorBlur);
        };
    }, [editor, flush]);

    // Update Editor Value When `type` or Attributes Change
    useEffect(() => {
        if (type === "label") {
            setEditorValue(deserialize(isChildBlock ? attributes?.label || "" : label));
        } else if (type === "description") {
            setEditorValue(deserialize(description));
        }
    }, [attributes, type, childIndex]);

    // Auto-focus and scroll logic
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

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
                    }
                }, 100);
            }
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [isAnimating, currentChildBlockId, childId, isChildBlock, type, editor]);

    // Optimized editor change handler
    const handleEditorChange = useCallback((value: any[]) => {
        const currentSerialized = serialize(editorValue);
        const newSerialized = serialize(value);

        // Only update if content actually changed
        if (newSerialized !== currentSerialized) {
            // Update local state immediately for responsive UI
            setEditorValue(value);

            // Debounce the actual block attribute update
            debouncedUpdate(newSerialized);
        }
    }, [editorValue, debouncedUpdate]);

    const editorRef = useRef(null);

    const handleFocus = useCallback(() => {
        if (!ReactEditor.isFocused(editor)) {
            ReactEditor.focus(editor);
        }
    }, [editor]);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        // Ensure any pending updates are saved when user blurs
        flush();
    }, [flush]);

    // Memoize merge tags to prevent unnecessary recalculations
    const mergeTags = useMemo(() => {
        let tags = prevFields.map((field) => ({
            type: 'field',
            label: field?.attributes?.label,
            modifier: field.id,
            icon: blockTypes[field.name]?.icon,
            color: blockTypes[field.name]?.color,
            order: field.order,
        }));

        tags = tags.concat(
            applyFilters('QuillForms.Builder.MergeTags', []) as any[]
        );

        if (correctIncorrectQuiz?.enabled) {
            tags = tags.concat([
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

        return tags;
    }, [prevFields, blockTypes, correctIncorrectQuiz?.enabled]);

    // Memoized styles
    const editorStyle = useMemo(() => css`
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
    `, []);

    const descriptionStyle = useMemo(() => css`
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
    `, []);

    const wrapperStyles = useMemo(() => css`
        &.block-editor-block-edit-label__editor:not(.is-focused) {
            [data-slate-placeholder="true"] {
                color: #757575 !important;
                opacity: 0.87 !important;
            }
        }

        .richtext__editor {
            position: relative;
        }

        [contenteditable] {
            position: relative;
            z-index: 1;
        }
    `, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Ensure any pending updates are saved when component unmounts
            flush();
        };
    }, [flush]);

    return (
        <div
            className={classNames(
                "block-editor-block-edit__editor",
                `block-editor-block-edit-${type}__editor`,
                { 'is-focused': isFocused },
                wrapperStyles
            )}
            onBlur={handleBlur}
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
        </div>
    );
};

export default BlockEditor;
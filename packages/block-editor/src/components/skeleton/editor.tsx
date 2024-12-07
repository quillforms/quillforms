import { useSelect, useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { autop } from '@wordpress/autop';
import { Editor, Transforms } from 'slate';
import { useState, useMemo, useEffect } from '@wordpress/element';

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

/**
 * BlockEditor Component
 */
const BlockEditor = ({ type }: { type: 'label' | 'description' }) => {
    // Selectors and Dispatch
    const { currentBlock, isAnimating } = useSelect((select) => ({
        currentBlock: select('quillForms/block-editor').getCurrentBlock(),
        isAnimating: select('quillForms/renderer-core').isAnimating(),
    }));

    const { setBlockAttributes } = useDispatch('quillForms/block-editor');

    // Destructure current block attributes
    const { attributes, id } = currentBlock || {};
    const label = attributes?.label || '';
    const description = attributes?.description || '';

    // Dynamically Initialize Editor and State Based on Type
    const editor = useMemo(() => createEditor(), []); // Single editor instance for both label and description
    const [editorValue, setEditorValue] = useState(() => {
        if (type === 'label') {
            return deserialize(label);
        }
        if (type === 'description') {
            return deserialize(autop(description));
        }
        return [];
    });

    // Handle State Changes When `type` Changes
    useEffect(() => {
        if (type === 'label') {
            setEditorValue(deserialize(label));
        } else if (type === 'description') {
            setEditorValue(deserialize(autop(description)));
        }
    }, [type, label, description]);

    // Merge Tags
    const { blockTypes, correctIncorrectQuiz, prevFields } = useSelect((select) => ({
        blockTypes: select('quillForms/blocks').getBlockTypes(),
        correctIncorrectQuiz: select('quillForms/quiz-editor').getState(),
        prevFields: select('quillForms/block-editor').getPreviousEditableFieldsWithOrder(id),
    }));

    const mergeTags = useMemo(() => {
        let tags = prevFields.map((field) => ({
            type: 'field',
            label: field?.attributes?.label,
            modifier: field.id,
            icon: blockTypes[field.name]?.icon,
            color: blockTypes[field.name]?.color,
            order: field.order,
        }));

        tags = tags.concat(applyFilters('QuillForms.Builder.MergeTags', []) as any[]);

        if (correctIncorrectQuiz?.enabled) {
            tags = tags.concat([
                {
                    type: 'quiz',
                    label: 'Correct Answers Count',
                    modifier: 'correct_answers_count',
                    icon: 'yes',
                    color: '#4caf50',
                },
                {
                    type: 'quiz',
                    label: 'Incorrect Answers Count',
                    modifier: 'incorrect_answers_count',
                    icon: 'no-alt',
                    color: '#f44336',
                },
                {
                    type: 'quiz',
                    label: 'Quiz Summary',
                    modifier: 'summary',
                    icon: 'editor-table',
                    color: '#4caf50',
                },
            ]);
        }

        return tags;
    }, [prevFields, blockTypes, correctIncorrectQuiz]);

    // Focus on Editor When Animation Ends or Type Changes
    useEffect(() => {
        if (!isAnimating) {
            setTimeout(() => {
                ReactEditor.focus(editor); // Focus the editor
                const point = Editor.end(editor, []); // Move cursor to the end
                Transforms.select(editor, point);
            }, 50); // Slight delay to ensure the editor is mounted
        }
    }, [isAnimating, type, editor]);

    // Handle Editor Change
    const handleEditorChange = (value: CustomNode[]) => {
        if (JSON.stringify(value) !== JSON.stringify(editorValue)) {
            setEditorValue(value);

            // Update block attributes in the store
            if (type === 'label') {
                setBlockAttributes(id, { label: serialize(value) });
            } else if (type === 'description') {
                setBlockAttributes(id, { description: serialize(value) });
            }
        }
    };

    // Editor Styling
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
        margin-top: 12px;
        p {
            opacity: 0.7;
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

    const handleFocus = () => {
        ReactEditor.focus(editor);
    };

    // Render Editor Based on Type
    return (
        <div className="block-editor-block-edit__editor">
            <TextEditor
                editor={editor}
                placeholder={type === 'label' ? 'Type question here...' : 'Add a description'}
                className={type === 'label' ? editorStyle : descriptionStyle}
                mergeTags={mergeTags}
                value={editorValue}
                onFocus={handleFocus}
                onChange={handleEditorChange}
                allowedFormats={['bold', 'italic', 'link']}
            />
        </div>
    );
};

export default BlockEditor;
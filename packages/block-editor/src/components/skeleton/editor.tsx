import { useSelect, useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
import { Editor, Transforms } from 'slate';

import { useState, useCallback, useMemo, useEffect } from '@wordpress/element';


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
import { useBlockTheme } from '@quillforms/renderer-core';
import type { CustomNode } from '@quillforms/admin-components';



/**
 * External Dependencies
 */
import { debounce } from 'lodash';
import { css } from 'emotion';

const BlockEditor = ({ type }) => {

    const { currentBlock, isAnimating } = useSelect(select => {
        return {
            currentBlock: select('quillForms/block-editor').getCurrentBlock(),
            isAnimating: select('quillForms/renderer-core').isAnimating(),
        }
    });

    const { attributes, id } = currentBlock;

    const label = attributes?.label ? attributes.label : '';
    const description = attributes?.description ? attributes.description : '';
    const getDeserializedValue = (val) => {
        return deserialize(val);
    };

    const [labelJsonVal, setLabelJsonVal] = useState<CustomNode[]>(getDeserializedValue(label));

    const [descJsonVal, setDescJsonVal] = useState<CustomNode[]>(getDeserializedValue(description));

    // Handling the error state


    // Deserialize value on mount
    useEffect(() => {
        setLabelJsonVal(getDeserializedValue(label));
        if (!!description)
            setDescJsonVal(getDeserializedValue(description));
    }, []);



    // @ts-expect-error
    const labelEditor: ReactEditor & HistoryEditor = useMemo(
        () => createEditor(),
        []
    );

    //@ts-expect-error
    const descEditor: ReactEditor & HistoryEditor = useMemo(
        () => createEditor(),
        []
    );


    useEffect(() => {
        if (!isAnimating) {
            setTimeout(() => {
                ReactEditor.focus(labelEditor);
                // Move selection to end of editor
                const point = Editor.end(labelEditor, []);
                Transforms.select(labelEditor, point);
            }, 50)
        }
    }, [isAnimating]);

    const { setBlockAttributes } =
        useDispatch('quillForms/block-editor');

    const { blockTypes, correctIncorrectQuiz, prevFields } = useSelect((select) => {
        return {
            blockTypes: select('quillForms/blocks').getBlockTypes(),
            correctIncorrectQuiz: select('quillForms/quiz-editor').getState(),
            prevFields: select(
                'quillForms/block-editor'
            ).getPreviousEditableFieldsWithOrder(id),
        };
    });

    // Serialize label is a debounced function that updates the store with serialized html value
    const serializeLabel = () => {
        setBlockAttributes(
            id,
            { label: serialize(labelJsonVal) },
            undefined
        );
    }

    // Serialize description is a debounced function that updates the store with serialized html value
    const serializeDesc = () => {
        setBlockAttributes(
            id,
            { description: serialize(descJsonVal) },
            undefined
        );
    }



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

    // Title Change Handler
    const labelChangeHandler = (value: Node[]) => {
        if (JSON.stringify(value) !== JSON.stringify(label)) {
            setLabelJsonVal(value);
            serializeLabel(value);
        }
    };

    // // Description Change Handler
    const descChangeHandler = (value) => {
        if (JSON.stringify(value) !== JSON.stringify(description)) {
            setDescJsonVal(value);
            serializeDesc(value);
        }
    };


    // Title Rich Text Editor
    const LabelEditor = useMemo(() => (
        <div className="block-editor-block-edit__title-editor">
            <TextEditor
                editor={labelEditor}
                placeholder="Type question here..."
                className={
                    css`
                        p {
                            color: inherit !important;
                            font-family:inherit !important;
                            margin: 0;
                            @media ( min-width: 768px ) {
                                font-size: inherit !important;
                                line-height: inherit !important;
                            }
                            @media ( max-width: 767px ) {
                                font-size: inherit !important;
                                line-height: inherit !important;
                            }
                        }
				    `
                }
                mergeTags={mergeTags}
                value={labelJsonVal}
                onChange={(value) => labelChangeHandler(value)}
                allowedFormats={['bold', 'italic', 'link']}
            />
        </div>
    ), [JSON.stringify(labelJsonVal), JSON.stringify(mergeTags), id]
    );

    const DescEditor = useMemo(
        () => (
            <div className="block-editor-block-edit__title-editor">
                <TextEditor
                    editor={descEditor}
                    placeholder="Add a description"
                    className={
                        css`
                            margin-top: 12px;

                            p {
                                opacity: 0.7;

                                color: inherit !important;
                                font-family:inherit !important;
                                @media ( min-width: 768px ) {
                                    font-size:inherit
                                .lg} !important;
                                    line-height: inherit !important;
                                }
                                @media ( max-width: 767px ) {
                                    font-size: inherit !important;
                                    line-height: inherit !important;
                                }
                            }
                        `
                    }
                    mergeTags={mergeTags}
                    value={descJsonVal}
                    onChange={(value) => descChangeHandler(value)}
                    onFocus={() => {
                        // if (parentId) {
                        //     setCurrentBlock(parentId);
                        //     setCurrentChildBlock(id);
                        // } else {
                        //     setCurrentBlock(id);
                        // }
                    }}
                    allowedFormats={['bold', 'italic', 'link']}
                />
            </div>
        ),
        [JSON.stringify(descJsonVal), JSON.stringify(mergeTags), id]
    );
    return (

        <>
            {type === 'label' && LabelEditor}
            {/* {type === 'description' && DescEditor} */}
        </>
    )
}

export default BlockEditor;


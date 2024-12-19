import { useSelect, useDispatch } from '@wordpress/data';
import { applyFilters } from '@wordpress/hooks';
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
import classnames from 'classnames';


const BlockEdit = ({
    id,
    parentId
}) => {

    const theme = useBlockTheme(id);
    const {
        blockTypes,
        block,
        correctIncorrectQuiz
    } = useSelect(select => {
        return {
            blockTypes: select('quillForms/blocks').getBlockTypes(),
            block: select('quillForms/block-editor').getBlockById(id),
            correctIncorrectQuiz: select('quillForms/quiz-editor').getState()

        }
    });
    const blockName = block?.name;

    const blockType = blockTypes[blockName];
    const { attributes: {
        label,
        description,
        layout
    } } = block;
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
        [id]
    );

    //@ts-expect-error
    const descEditor: ReactEditor & HistoryEditor = useMemo(
        () => createEditor(),
        [id]
    );

    const {
        currentBlock
    } = useSelect((select) => {
        return {
            currentBlock: select('quillForms/block-editor').getCurrentBlock()
        }
    });

    const { setBlockAttributes } =
        useDispatch('quillForms/block-editor');



    const { prevFields } = useSelect((select) => {
        return {
            prevFields: select(
                'quillForms/block-editor'
            ).getPreviousEditableFieldsWithOrder(id),
        };
    });

    // Serialize label is a debounced function that updates the store with serialized html value
    const serializeLabel = useCallback(
        debounce((value) => {
            setBlockAttributes(id, { label: serialize(value) }, parentId);
        }, 200),
        []
    );

    // Serialize description is a debounced function that updates the store with serialized html value
    const serializeDesc = useCallback(
        debounce((value) => {
            setBlockAttributes(
                id,
                { description: serialize(value) },
                parentId
            );
        }, 200),
        []
    );


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
    const LabelEditor = useMemo(
        () => (
            <div className="block-editor-block-edit__title-editor">
                <TextEditor
                    editor={labelEditor}
                    placeholder="Type question here..."
                    className={
                        css`
                        p {
                            color: ${theme.questionsColor} !important;
                            font-family: ${theme.questionsLabelFont} !important;
                            @media ( min-width: 768px ) {
                                font-size: ${theme.questionsLabelFontSize
                                .lg} !important;
                                line-height: ${theme.questionsLabelLineHeight
                                .lg} !important;
                            }
                            @media ( max-width: 767px ) {
                                font-size: ${theme.questionsLabelFontSize
                                .sm} !important;
                                line-height: ${theme.questionsLabelLineHeight
                                .sm} !important;
                            }
                        }
				    `
                    }
                    mergeTags={mergeTags}
                    value={labelJsonVal}
                    onChange={(value) => labelChangeHandler(value)}
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
        [JSON.stringify(labelJsonVal), JSON.stringify(mergeTags), id]
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

                                color: ${theme.questionsColor} !important;
                                font-family: ${theme.questionsDescriptionFont} !important;
                                @media ( min-width: 768px ) {
                                    font-size: ${theme.questionsDescriptionFontSize
                                .lg} !important;
                                    line-height: ${theme.questionsDescriptionLineHeight
                                .lg} !important;
                                }
                                @media ( max-width: 767px ) {
                                    font-size: ${theme.questionsDescriptionFontSize
                                .sm} !important;
                                    line-height: ${theme.questionsDescriptionLineHeight
                                .sm} !important;
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

        <div className="block-editor-block-edit__wrapper">
            <section
                id={'block-' + id}
                className={classnames(
                    `blocktype-${blockName}-block`,
                    `renderer-core-block-${layout}-layout`,
                    {
                        'with-attachment':
                            blockType?.supports.attachment,
                    }
                )}
            >
                <div
                    className="renderer-components-field-wrapper__content-wrapper renderer-components-block__content-wrapper"
                >
                    <div
                        className="renderer-core-block-scroller"
                    >
                        <FieldContent />
                    </div>
                </div>
                {((layout !== 'stack' ||
                    (layout === 'split-left' ||
                        layout === 'split-right'))) &&
                    blockType?.supports?.attachment && (
                        <div
                            className={classnames(
                                'renderer-core-block-attachment-wrapper',
                                css`
											img {
												object-position: ${
                                    // @ts-expect-error
                                    attributes
                                        ?.attachmentFocalPoint
                                        ?.x * 100
                                    }%
													${
                                    // @ts-expect-error
                                    attributes
                                        ?.attachmentFocalPoint
                                        ?.y * 100
                                    }%;
											}
										`
                            )}
                        >
                            <BlockAttachment />
                        </div>
                    )}
            </section>

            <div className="block-editor-block-edit">
                {currentBlock && (
                    <div className="block-editor-block-edit__content">
                        <div className="block-editor-block-edit__label">
                            {LabelEditor}
                            {DescEditor}
                        </div>
                        <div className='block-editor-block-edit__description'>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BlockEdit;
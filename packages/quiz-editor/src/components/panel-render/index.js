import { BlockIconBox, ToggleControl } from '@quillforms/admin-components';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

const PanelRender = () => {
    const { blocks, blockTypes } = useSelect((select) => {
        return {
            blocks: select('quillForms/block-editor').getBlocks(),
            blockTypes: select('quillForms/blocks').getBlockTypes()
        };
    });

    let supportedBlocks = [];

    forEach(blocks, block => {
        const blockName = block.name;
        if (blockTypes[blockName]?.supports['correctAnswers']) {
            supportedBlocks.push(block)
        }
    });


    // Simple algorithm to generate alphabatical idented order
    const identName = (a) => {
        const b = [a];
        let sp, out, i, div;

        sp = 0;
        while (sp < b.length) {
            if (b[sp] > 25) {
                div = Math.floor(b[sp] / 26);
                b[sp + 1] = div - 1;
                b[sp] %= 26;
            }
            sp += 1;
        }

        out = '';
        for (i = 0; i < b.length; i += 1) {
            out = String.fromCharCode('a'.charCodeAt(0) + b[i]) + out;
        }

        return out;
    };

    return (
        <div>
            {
                supportedBlocks.map((block) => {
                    const blockType = blockTypes[block.name];
                    // for now, we will support multiple choice, dropdown and picture choice questions.
                    if (!blockType.supports.choices) {
                        return null;
                    }

                    const choices = blockType.getChoices({
                        id: block.id,
                        attributes: block.attributes ?? {},
                    });
                    return (
                        <div
                            key={block.id}
                            className='quiz-editor-block'
                        >
                            <div className='quiz-editor-block-header'>
                                <BlockIconBox
                                    icon={blockType?.icon}
                                    color={blockType?.color}
                                />
                                <div
                                    className={css`
									flex: 1;
									margin-left: 15px;
								`}
                                >
                                    {block.attributes?.label}
                                </div>
                            </div>
                            <div className='quiz-editor-block-body'>
                                <div className='quiz-editor-block-choice'>
                                    <div className='quiz-editor-block-choice-label-wrapper'>
                                        Answer
                                    </div>
                                    <div>
                                        Correct?
                                    </div>
                                </div>
                                {choices &&
                                    choices.map((choice, index) => {
                                        const label = choice.label;
                                        const choiceId = choice.value;

                                        return (
                                            <div
                                                key={choiceId}
                                                className='quiz-editor-block-choice'
                                            >
                                                <div className='quiz-editor-block-choice-label-wrapper'>
                                                    <div
                                                        className={classnames(
                                                            'points-block-choice-label-key',
                                                            css`
															display: flex;
															justify-content: center;
															align-items: center;
															font-size: 11px;
															background: ${blockType.color};
															width: 24px;
															height: 24px;
															border-radius: 3px;
															color: #fff;
															margin-right: 10px;
														`
                                                        )}
                                                    >
                                                        {identName(
                                                            index
                                                        ).toUpperCase()}
                                                    </div>
                                                    <div className='points-block-choice-label'>
                                                        {label}
                                                    </div>
                                                </div>
                                                <div>
                                                    <ToggleControl />
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    );
                })
            }

        </div >
    );
};
export default PanelRender;

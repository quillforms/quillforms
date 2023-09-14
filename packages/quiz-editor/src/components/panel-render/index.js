import { BaseControl, BlockIconBox, ControlWrapper, ControlLabel, ToggleControl } from '@quillforms/admin-components';
import { useDispatch, useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import { forEach, size } from 'lodash';
import { css } from 'emotion';
import classnames from 'classnames';

const PanelRender = () => {
    const { blocks, blockTypes, correctAnswers, enabled, displayAnswersDuringQuiz } = useSelect((select) => {
        return {
            blocks: select('quillForms/block-editor').getBlocks(),
            blockTypes: select('quillForms/blocks').getBlockTypes(),
            correctAnswers: select('quillForms/quiz-editor').getCorrectAnswers(),
            enabled: select('quillForms/quiz-editor').isEnabled(),
            displayAnswersDuringQuiz: select('quillForms/quiz-editor').displayAnswersDuringQuiz()
        };
    });

    const { setCorrectAnswers, toggleCorrectIncorrectQuizMode, showAnswersDuringQuiz } = useDispatch('quillForms/quiz-editor');
    const { resetAnswers } = useDispatch('quillForms/renderer-core');

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
            <BaseControl>
                <ControlWrapper orientation='horizontal'>
                    <ControlLabel label="Enable Correct/Incorrect Answers Mode" />
                    <ToggleControl checked={enabled} onChange={() => {
                        if (enabled) {
                            resetAnswers();
                        }
                        toggleCorrectIncorrectQuizMode(!enabled);
                    }} />
                </ControlWrapper>
            </BaseControl>
            {enabled && (
                <>
                    <BaseControl>
                        <ControlWrapper orientation='horizontal'>
                            <ControlLabel label="Display Answers During Quiz" />
                            <ToggleControl checked={displayAnswersDuringQuiz} onChange={() => {
                                resetAnswers();
                                showAnswersDuringQuiz(!displayAnswersDuringQuiz);
                            }} />
                        </ControlWrapper>
                    </BaseControl>
                    <BaseControl>
                        <ControlWrapper orientation='vertical'>
                            <ControlLabel label="Useful tags to use" />
                            <div className='quiz-editor-tags'>
                                <div className='quiz-editor-tag'>
                                    <div className='quiz-editor-tag-key'>
                                        {`{{quiz:correct_answers_count}}`}
                                    </div>
                                    <div className='quiz-editor-tag-explanation'>
                                        {`Prints the number of correct answers`}
                                    </div>
                                </div>
                                <div className='quiz-editor-tag'>
                                    <div className='quiz-editor-tag-key'>
                                        {`{{quiz:incorrect_answers_count}}`}
                                    </div>
                                    <div className='quiz-editor-tag-explanation'>
                                        {`Prints the number of incorrect answers`}
                                    </div>
                                </div>
                                <div className='quiz-editor-tag'>
                                    <div className='quiz-editor-tag-key'>
                                        {`{{quiz:summary}}`}
                                    </div>
                                    <div className='quiz-editor-tag-explanation'>
                                        {`presents each question along with the answer's correctness, followed by an explanation if available.`}
                                    </div>
                                </div>
                            </div>
                            <div className={css`  
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100px;
                                margin-top: 30px;
                                background: #ffeec1;
                                color: #85855b;
                                font-size: 14px;`}>
                                Assingning points can be done from "Calculator" panel then click on "Points" subpanel.
                            </div>
                        </ControlWrapper>
                    </BaseControl>
                    <BaseControl>
                        <ControlWrapper orientation='vertical'>
                            <ControlLabel label="Set Correct Answers" />
                            {size(supportedBlocks) === 0 ? (<div className={css`
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                height: 100px;
                                background: #ffeec1;
                                color: #85855b;
                                font-size: 14px;
                            `}>Please add at least one multiple choice question or a picture choice one</div>
                            ) : (

                                <>
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
                                                                            <ToggleControl
                                                                                checked={correctAnswers?.[block.id]?.['correctAnswers']?.includes(choiceId)}
                                                                                onChange={() => {
                                                                                    const newCorrectAnswers = {
                                                                                        ...correctAnswers,
                                                                                        [block.id]: {
                                                                                            ...correctAnswers?.[block.id],
                                                                                            correctAnswers: correctAnswers?.[block.id]?.['correctAnswers']?.includes(choiceId) ?
                                                                                                correctAnswers?.[block.id]?.['correctAnswers']?.filter((item) => item !== choiceId) :
                                                                                                [...(correctAnswers?.[block.id]?.['correctAnswers'] ?? []), choiceId]

                                                                                        }
                                                                                    }
                                                                                    setCorrectAnswers(newCorrectAnswers);
                                                                                }} />
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}

                                                        <div className='quiz-editor-question-explanation'>
                                                            <div className='quiz-editor-question-explanation-label'>
                                                                Explanation
                                                            </div>
                                                            <div className='quiz-editor-question-explanation-input'>
                                                                <textarea
                                                                    value={correctAnswers?.[block.id]?.['explanation']}
                                                                    onChange={(e) => {
                                                                        const newCorrectAnswers = {
                                                                            ...correctAnswers,
                                                                            [block.id]: {
                                                                                ...correctAnswers?.[block.id],
                                                                                explanation: e.target.value
                                                                            }
                                                                        }
                                                                        setCorrectAnswers(newCorrectAnswers);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            )}
                        </ControlWrapper>
                    </BaseControl>
                </>
            )}

        </div >
    );
};
export default PanelRender;

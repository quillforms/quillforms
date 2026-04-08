import { BaseControl, BlockIconBox, ControlWrapper, ControlLabel, ToggleControl } from '@quillforms/admin-components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useMemo, useRef, useState } from 'react';
import ArrowUpIcon from '../icons/arrow-up';
import ArrowRightIcon from '../icons/arrow-right';
/**
 * External Dependencies
 */
import { forEach, size } from 'lodash';

/**
 * Internal Dependencies
 */
import InfoBox from './info-box';
import CorrectIcon from '../icons/correct';





const PanelRender = () => {
    const [isTagsOpen, setIsTagsOpen] = useState(true);
    const [activeQuestion, setActiveQuestion] = useState(null);
    const [openAnswerDropdown, setOpenAnswerDropdown] = useState({});
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
    const { setCurrentPanel, setCurrentSubPanel } = useDispatch('quillForms/builder-panels');
    const initialSnapshotRef = useRef(null);

    let supportedBlocks = [];

    forEach(blocks, block => {
        const blockName = block.name;
        if (blockTypes[blockName]?.supports['correctAnswers']) {
            supportedBlocks.push(block)
        }
    });

    const currentSnapshot = useMemo(
        () =>
            JSON.stringify({
                enabled: !!enabled,
                displayAnswersDuringQuiz: !!displayAnswersDuringQuiz,
                correctAnswers: correctAnswers ?? {},
            }),
        [enabled, displayAnswersDuringQuiz, correctAnswers]
    );

    if (!initialSnapshotRef.current) {
        initialSnapshotRef.current = currentSnapshot;
    }

    const hasChanges = initialSnapshotRef.current !== currentSnapshot;

    const applySnapshot = (snapshotString) => {
        const snapshot = JSON.parse(snapshotString);
        toggleCorrectIncorrectQuizMode(!!snapshot.enabled);
        showAnswersDuringQuiz(!!snapshot.displayAnswersDuringQuiz);
        setCorrectAnswers(snapshot.correctAnswers ?? {});
    };

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
        return out.toUpperCase();
    };

    return (
        <div className='quiz-editor-panel-render'>
            <div className='quiz-editor-panel-render__body'>
            <BaseControl>
					<div className='quiz-editor-panel-render__enable-correct-incorrect-answers-mode-container'>
                    <ControlLabel label="Enable Correct/Incorrect Answers Mode" />
                    <ToggleControl checked={enabled} onChange={() => {
                        if (enabled) {
                            resetAnswers();
                        }
                        toggleCorrectIncorrectQuizMode(!enabled);
                    }} />
					</div>
            </BaseControl>
            {enabled && (
                <>
                    <BaseControl>
					   <div className='quiz-editor-panel-render__enable-correct-incorrect-answers-mode-container'>
                            <ControlLabel label="Display Answers During Quiz" />
                            <ToggleControl checked={displayAnswersDuringQuiz} onChange={() => {
                                resetAnswers();
                                showAnswersDuringQuiz(!displayAnswersDuringQuiz);
                            }} />
                        </div>
                    </BaseControl>
                    <BaseControl>
                        <ControlWrapper orientation='vertical'>
                            <div className='quiz-editor-tags-section'>
                                <button
                                    type="button"
                                    className='quiz-editor-tags-section__header'
                                    onClick={() => setIsTagsOpen((prev) => !prev)}
                                >
                                    <span className='quiz-editor-tags-section__title'>
                                        Useful tags to use
                                    </span>
                                    <span className='quiz-editor-tags-section__chevron'>
                                        {isTagsOpen ? <ArrowUpIcon /> : <ArrowRightIcon />}
                                    </span>
                                </button>
                                {isTagsOpen && (
                                    <>
                                        <div className='quiz-editor-tags-section__divider' />
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
                                                    {`Presents each question along with the answer's correctness, followed by an explanation if available.`}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <InfoBox type="calculator">
                                Assigning points can be done from "Calculator" panel then click on "Points" subpanel.
                            </InfoBox>
                        </ControlWrapper>
                    </BaseControl>
					<div className='divider'></div>
                    <BaseControl>
                        <div className='quiz-editor-panel-render__set-correct-answers-container'>
                            <ControlLabel label="Set Correct Answers" />
                            {size(supportedBlocks) === 0 ? (<InfoBox type="info">
                                Please add at least one multiple choice question or a picture choice one
                            </InfoBox>
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
                                            const isOpen =
                                                (activeQuestion ?? supportedBlocks?.[0]?.id) ===
                                                block.id;
                                            const selectedChoice =
                                                correctAnswers?.[block.id]?.['correctAnswers']?.[0] ?? '';
                                            return (
                                                <div
                                                    key={block.id}
                                                    className='quiz-editor-block'
                                                >
                                                    <button
                                                        type="button"
                                                        className={`quiz-editor-block-header ${isOpen ? 'is-open' : ''}`}
                                                        onClick={() =>
                                                            setActiveQuestion(isOpen ? null : block.id)
                                                        }
                                                    >
                                                        <div className='quiz-editor-block-header-left'>
                                                            <div className='quiz-editor-block-order'>
                                                                2-
                                                            </div>
                                                            <BlockIconBox
                                                                icon={blockType?.icon}
                                                                color={blockType?.color}
                                                            />
                                                            <div className='quiz-editor-block-title'>
                                                                {block.attributes?.label || 'Question Name'}
                                                            </div>
                                                        </div>
                                                        <span className='quiz-editor-block-header-arrow'>
                                                            {isOpen ? <ArrowUpIcon /> : <ArrowRightIcon />}
                                                        </span>
                                                    </button>
                                                    {isOpen && (
                                                        <div className='quiz-editor-block-body'>
                                                            <div className='quiz-editor-question-field'>
                                                                <div className='quiz-editor-question-field-label'>
                                                                    Choose Correct Answer
                                                                </div>
                                                                <div className='quiz-editor-question-field-input quiz-editor-custom-select'>
                                                                    <button
                                                                        type='button'
                                                                        className='quiz-editor-custom-select__trigger'
                                                                        onClick={() => {
                                                                            setOpenAnswerDropdown((prev) => ({
                                                                                ...prev,
                                                                                [block.id]: !prev?.[block.id]
                                                                            }));
                                                                        }}
                                                                    >
                                                                        <span>
                                                                            {selectedChoice
                                                                                ? (
                                                                                    (choices ?? []).find(
                                                                                        (choice) => choice.value === selectedChoice
                                                                                    )?.label?.replace?.(/<[^>]*>/g, '') || selectedChoice
                                                                                )
                                                                                : 'Choose Correct Answer'}
                                                                        </span>
                                                                        <span className='quiz-editor-custom-select__arrow'>
                                                                            <ArrowRightIcon width={16} height={16} />
                                                                        </span>
                                                                    </button>
                                                                    {openAnswerDropdown?.[block.id] && (
                                                                        <div className='quiz-editor-custom-select__menu'>
                                                                            {(choices ?? []).map((choice, index) => {
                                                                                const isSelected = selectedChoice === choice.value;
                                                                                return (
                                                                                    <button
                                                                                        key={choice.value}
                                                                                        type='button'
                                                                                        className='quiz-editor-custom-select__option'
                                                                                        onClick={() => {
                                                                                            const newCorrectAnswers = {
                                                                                                ...correctAnswers,
                                                                                                [block.id]: {
                                                                                                    ...correctAnswers?.[block.id],
                                                                                                    correctAnswers: [choice.value]
                                                                                                }
                                                                                            };
                                                                                            setCorrectAnswers(newCorrectAnswers);
                                                                                            setOpenAnswerDropdown((prev) => ({
                                                                                                ...prev,
                                                                                                [block.id]: false
                                                                                            }));
                                                                                        }}
                                                                                    >
                                                                                        <span className='quiz-editor-custom-select__option-key'>
                                                                                            {identName(index)}
                                                                                        </span>
                                                                                        <span
                                                                                            className='quiz-editor-custom-select__option-label'
                                                                                            dangerouslySetInnerHTML={{
                                                                                                __html:
                                                                                                    choice.label || choice.value
                                                                                            }}
                                                                                        />
                                                                                        <span className='quiz-editor-custom-select__option-check'>
                                                                                            {isSelected ? <CorrectIcon/> : ''}
                                                                                        </span>
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className='quiz-editor-question-explanation'>
                                                                <div className='quiz-editor-question-explanation-label'>
                                                                    Explanation <span>*</span>
                                                                </div>
                                                                <div className='quiz-editor-question-explanation-input'>
                                                                    <textarea
                                                                        placeholder='Type here...'
                                                                        value={correctAnswers?.[block.id]?.['explanation'] || ''}
                                                                        onChange={(e) => {
                                                                            const newCorrectAnswers = {
                                                                                ...correctAnswers,
                                                                                [block.id]: {
                                                                                    ...correctAnswers?.[block.id],
                                                                                    explanation: e.target.value
                                                                                }
                                                                            };
                                                                            setCorrectAnswers(newCorrectAnswers);
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    }
                                </>
                            )}
                        </div>
                    </BaseControl>
                </>
            )}
            </div>

            <div className='quiz-editor-footer'>
                <button
                    type='button'
                    className='quiz-editor-footer__cancel'
                    onClick={() => {
                        applySnapshot(initialSnapshotRef.current);
                        setCurrentSubPanel('');
                        setCurrentPanel('');
                    }}
                >
                    Cancel
                </button>
                <button
                    type='button'
                    className={`quiz-editor-footer__save ${hasChanges ? 'is-active' : ''}`}
                    disabled={!hasChanges}
                    onClick={() => {
                        initialSnapshotRef.current = currentSnapshot;
                        setCurrentSubPanel('');
                        setCurrentPanel('');
                    }}
                >
                    Save
                </button>
            </div>
        </div>
    );
};
export default PanelRender;

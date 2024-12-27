import { BlockControls } from '@quillforms/block-editor';
import { useEffect, useState } from 'react';
import { useSelect } from '@wordpress/data';
import { ThemesRender } from "@quillforms/theme-editor";
import JumpLogicIcon from './logic-icon';
import CalculatorIcon from './calculator-icon';
import { useDispatch } from '@wordpress/data';

const BlockControlsPanel = () => {
    const [activeTab, setActiveTab] = useState('question');

    // Important for the current rich text editor; unmount completely for it.
    const [isReady, setIsReady] = useState(false);

    const { currentBlockId, currentChildId } = useSelect((select) => {
        return {
            currentBlockId: select('quillForms/block-editor').getCurrentBlockId(),
            currentChildId: select('quillForms/block-editor').getCurrentChildBlockId(),
        };
    });

    const { setCurrentPanel } = useDispatch('quillForms/builder-panels');

    useEffect(() => {
        setIsReady(false);
        if (activeTab === 'logic') {
            setActiveTab('question');
        }
        setTimeout(() => {
            setIsReady(true);
        }, 50);
    }, [currentBlockId, currentChildId]);

    return (
        <div className="builder-core-block-right-panel">
            <div className="tabs">
                <div
                    className={`tab ${activeTab === 'question' ? 'active' : ''}`}
                    onClick={() => setActiveTab('question')}
                >
                    Question
                </div>
                <div
                    className={`tab ${activeTab === 'design' ? 'active' : ''}`}
                    onClick={() => setActiveTab('design')}
                >
                    Design
                </div>
                <div
                    className={`tab ${activeTab === 'logic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logic')}
                >
                    Logic
                </div>
            </div>

            <div className="tab-content">
                {isReady && (
                    <>
                        {activeTab === 'question' && <BlockControls />}
                        {activeTab === 'design' && <ThemesRender />}
                        {activeTab === "logic" && (
                            <div className="logic-tab-content">
                                <button className="logic-button" onClick={
                                    () => {
                                        setCurrentPanel('jump-logic');
                                    }
                                }>
                                    <JumpLogicIcon />
                                    Jump Logic
                                </button>
                                <button className="logic-button" onClick={() => {
                                    setCurrentPanel('calculator');
                                }}>
                                    <CalculatorIcon />
                                    Calculator
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlockControlsPanel;
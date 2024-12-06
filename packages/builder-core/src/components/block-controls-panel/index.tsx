import { BlockControls } from '@quillforms/block-editor';
import { useEffect, useState } from 'react';
import { useSelect } from "@wordpress/data";
const BlockControlsPanel = () => {
    const [activeTab, setActiveTab] = useState('content');

    // this is important for the current rich text editor, we need to unmount completely for it so this is a trick until we change it.
    const [isReady, setIsReady] = useState(false);

    const { currentBlockId, currentChildId } = useSelect((select) => {
        return {
            currentBlockId: select('quillForms/block-editor').getCurrentBlockId(),
            currentChildId: select('quillForms/block-editor').getCurrentChildBlockId()
        }
    });
    useEffect(() => {
        setIsReady(false);
        setTimeout(() => {
            setIsReady(true);

        }, 50);
    }, [currentBlockId, currentChildId]);

    return (
        <div className="builder-core-block-controls-panel">
            {isReady
                && <BlockControls />}
        </div>
    )

}

export default BlockControlsPanel;
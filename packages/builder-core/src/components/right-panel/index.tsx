import { BlockControls } from '@quillforms/block-editor';
import { useEffect, useState } from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

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

	useEffect(() => {
		setIsReady(false);
		setActiveTab('question');
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
					{__('Question', 'quillforms')}
				</div>
			</div>

			<div className="tab-content">
				{isReady && (
					<>
						{activeTab === 'question' && <BlockControls />}
					</>
				)}
			</div>
		</div>
	);
};

export default BlockControlsPanel;

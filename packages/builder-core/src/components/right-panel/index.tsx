import { BlockControls } from '@quillforms/block-editor';
import { useEffect, useState } from 'react';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const BlockControlsPanel = () => {
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
		setTimeout(() => {
			setIsReady(true);
		}, 50);
	}, [currentBlockId, currentChildId]);

	return (
		<div className="builder-core-block-right-panel">
			<h2 className="builder-core-block-right-panel__title">
				{__('Questions Settings', 'quillforms')}
			</h2>

			<div className="tab-content">
				{isReady && <BlockControls />}
			</div>
		</div>
	);
};

export default BlockControlsPanel;

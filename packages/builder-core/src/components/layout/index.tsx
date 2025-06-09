/**
 * QuillForms Dependencies
 */
import { BlockEditSkeleton } from '@quillforms/block-editor';
/**
 * WordPress Dependencies
 */
import { useState, useMemo, useEffect } from 'react';
import { useSelect, useDispatch } from '@wordpress/data';


/**
 * Internal Dependencies
 */
import Panel from '../panel';
import BuilderPanelsBar from '../panels-bar';

import { set, size } from 'lodash';
import BlocksStructure from '../blocks-structure';
import BlockControlsPanel from '../right-panel';
import PartialSubmissionPointContent from '../partial-submission-point-content';

interface Props {
	formId: number;
}
const Layout: React.FC<Props> = ({ formId }) => {

	const { formBlocks, blockTypes, currentBlockId, currentPanel } = useSelect(
		(select) => {
			return {
				currentBlockId: select('quillForms/block-editor').getCurrentBlockId(),
				currentPanel: select('quillForms/builder-panels').getCurrentPanel(),
				formBlocks: select('quillForms/block-editor').getBlocksWithPartialSubmission(),
				blockTypes: select('quillForms/blocks').getBlockTypes(),
			};
		}
	);
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-core'
	);

	const hasIncorrectFieldMergeTags = (a: number, b: number): boolean => {
		const list = [...formBlocks];
		const { attributes } = list[a];
		const label = attributes?.label ? attributes.label : '';
		const description = attributes?.description
			? attributes.description
			: '';
		const regex = /{{field:([a-zA-Z0-9-_]+)}}/g;
		let match;

		while ((match = regex.exec(label + ' ' + description))) {
			const fieldId = match[1];
			const fieldIndex = formBlocks.findIndex(
				(field) => field.id === fieldId
			);
			if (fieldIndex >= b) {
				return true;
			}
		}
		return false;
	};



	const builderPanelsBar = useMemo(() => {
		return <BuilderPanelsBar />;
	}, []);

	const panel = useMemo(() => {
		return <Panel />;
	}, []);

	const [isReady, setIsReady] = useState(false);


	useEffect(() => {
		setIsReady(false);
		setTimeout(() => {
			setIsReady(true);
		}, 100);
	}, [])

	return (
		<div
			className="builder-core-layout"
			onKeyDown={(e) => e.stopPropagation()}
		>
			{isReady && (
				<>
					{/* Builder Panels Bar */}
					{builderPanelsBar}

					{/* Main Content */}
					{currentPanel?.type !== 'full-screen' && (
						<>
							{/* Blocks Structure */}
							{(!currentPanel || currentPanel?.type === 'modal') && (
								<BlocksStructure />
							)}

							{/* Content Area */}
							{currentBlockId === 'partial-submission-point'
								? <PartialSubmissionPointContent />
								: <BlockEditSkeleton />
							}
						</>
					)}

					{/* Current Panel */}
					{currentPanel && panel}

					{/* Controls Panel */}
					{currentPanel?.type !== 'full-screen' &&
						currentBlockId !== 'partial-submission-point' && (
							<BlockControlsPanel />
						)}
				</>
			)}
		</div>
	);
};

export default Layout;

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

import { size } from 'lodash';
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
				formBlocks: select('quillForms/block-editor').getBlocks(),
				blockTypes: select('quillForms/blocks').getBlockTypes(),
			};
		}
	);
	const { setCurrentBlock } = useDispatch(
		'quillForms/block-editor'
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

	// Setting current block id once blocks are resolved.
	useEffect(() => {
		if (formBlocks?.length > 0) {
			setCurrentBlock(formBlocks[0].id);
			formBlocks.forEach((block) => {
				let blockType = blockTypes[block.name];
				if (blockType.supports.editable)
					insertEmptyFieldAnswer(block.id, block.name);

				if (
					blockType.supports.innerBlocks &&
					size(block?.innerBlocks) > 0
				) {
					block?.innerBlocks.forEach((childBlock) => {
						blockType = blockTypes[childBlock.name];
						if (blockType?.supports?.editable)
							insertEmptyFieldAnswer(
								childBlock.id,
								childBlock.name
							);
					});
				}
			});
		}
	}, []);

	return (
		<div
			className="builder-core-layout"
			onKeyDown={(e) => e.stopPropagation()}
		>
			{isReady &&
				<>
					{builderPanelsBar}


					{(!currentPanel || currentPanel?.type === 'modal') && <BlocksStructure />}

					{currentBlockId === 'partial-submission-point' ? <PartialSubmissionPointContent /> : <BlockEditSkeleton />}
					{currentPanel && panel}
					{currentBlockId !== 'partial-submission-point' &&
						<BlockControlsPanel />}

				</>
			}

		</div>
	);
};

export default Layout;

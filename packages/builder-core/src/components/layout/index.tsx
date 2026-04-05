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

const CALCULATOR_FAMILY_PANEL_NAMES = [
	'calculator',
	'calculator-points',
	'calculator-variables',
] as const;

function isCalculatorFamilyPanel(name: string | undefined): boolean {
	return (
		!!name &&
		(CALCULATOR_FAMILY_PANEL_NAMES as readonly string[]).includes(name)
	);
}

interface Props {
	formId: number;
	/** When true (Logic admin route), calculator / points / variables modals stack over the jump-logic canvas. */
	isLogicRoute?: boolean;
}
const Layout: React.FC<Props> = ({ formId, isLogicRoute = false }) => {

	const { formBlocks, blockTypes, currentBlockId, currentPanel, jumpLogicPanel } =
		useSelect((select) => {
			return {
				currentBlockId: select('quillForms/block-editor').getCurrentBlockId(),
				currentPanel: select('quillForms/builder-panels').getCurrentPanel(),
				jumpLogicPanel: select('quillForms/builder-panels').getPanelByName(
					'jump-logic'
				),
				formBlocks: select('quillForms/block-editor').getBlocksWithPartialSubmission(),
				blockTypes: select('quillForms/blocks').getBlockTypes(),
			};
		});
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
		return <Panel isLogicRoute={isLogicRoute} />;
	}, [isLogicRoute]);

	const [isReady, setIsReady] = useState(false);

	const showCalculatorOverJumpLogic =
		isLogicRoute &&
		isCalculatorFamilyPanel(currentPanel?.name) &&
		!!jumpLogicPanel?.render;

	const JumpLogicRender = jumpLogicPanel?.render;

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

					{/* Jump logic canvas stays visible (non-interactive) under calculator / points / variables */}
					{showCalculatorOverJumpLogic && JumpLogicRender && (
						<div
							className="builder-core-jump-logic-underlay"
							aria-hidden="true"
						>
							<div className="builder-core-full-screen-panel builder-core-jump-logic-underlay__screen">
								<div className="builder-core-panel builder-core-jump-logic-panel">
									<div className="builder-core-panel__content-wrapper">
										{/* @ts-expect-error Panel render is a component */}
										<JumpLogicRender />
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Main Content */}
					{currentPanel?.type !== 'full-screen' &&
						!showCalculatorOverJumpLogic && (
						<>
							{/* Blocks Structure */}
							{currentPanel?.name === 'theme' ? (
								panel
							) : (
								(!currentPanel || currentPanel?.type === 'modal') && (
									<BlocksStructure />
								)
							)}

							{/* Content Area */}
							{currentBlockId === 'partial-submission-point'
								? <PartialSubmissionPointContent />
								: <BlockEditSkeleton />
							}
						</>
					)}

					{/* Current Panel */}
					{currentPanel && currentPanel?.name !== 'theme' && panel}

					{/* Controls Panel */}
					{currentPanel?.type !== 'full-screen' &&
						!showCalculatorOverJumpLogic &&
						currentBlockId !== 'partial-submission-point' && (
							<BlockControlsPanel />
						)}
				</>
			)}
		</div>
	);
};

export default Layout;

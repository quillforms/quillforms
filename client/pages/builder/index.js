/**
 * QuillForms Dependencies
 */
import { BuilderLayout, FullPreviewLayout } from '@quillforms/builder-core';
import { FormAdminBarActions } from '@quillforms/admin-components';
import configApi from '@quillforms/config';
import { matchPath } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { map, uniq } from 'lodash';
import { ThreeDots as Loader } from 'react-loader-spinner';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import SaveButton from './save-button';
import './style.scss';
import FullPreviewIcon from './full-preview';

const Builder = ({ params, path, isLogicRoute: isLogicRouteProp = false }) => {
	const [fullPreviewMode, setFullPreviewMode] = useState(false);
	const { id } = params;

	// Prefer explicit prop (Logic page), else detect from router URL so calculator modals
	// stack over jump logic — not over the design (blocks) view.
	const pathForMatch =
		typeof path === 'string' ? path.replace(/\?.*$/, '').replace(/\/+$/, '') : '';
	const isLogicRoute =
		isLogicRouteProp ||
		Boolean(
			pathForMatch &&
				matchPath(pathForMatch, {
					path: '/forms/:id/logic',
					exact: true,
				})
		);

	const { setCurrentPanel } = useDispatch('quillForms/builder-panels');
	const { resetAnswers } = useDispatch('quillForms/renderer-core');
	const { setCurrentBlock } = useDispatch('quillForms/block-editor');

	const [unknownBlocks, setUnknownBlocks] = useState(undefined);

	const { hasBlockEditorFinishedResolution, blockTypes } = useSelect(
		(select) => {
			return {
			hasBlockEditorFinishedResolution: select(
				'quillForms/block-editor'
			)?.hasFinishedResolution('getBlocksWithPartialSubmission'),
				blockTypes: select('quillForms/blocks').getBlockTypes(),
			};
		}
	);

	// From store only — avoids stuck "loading" when remounting after visiting Share/Results/etc.
	const isResolving = !hasBlockEditorFinishedResolution;

	useEffect(() => {
		const initialPayload = configApi.getInitialPayload();
		if (initialPayload?.blocks?.length) {
			const unKnownBlocks = initialPayload.blocks.filter(
				(block) => !blockTypes[block.name]
			);

			if (unKnownBlocks?.length) {
				setUnknownBlocks(
					uniq(map(unKnownBlocks, (block) => block.name))
				);
			} else {
				setCurrentBlock(initialPayload.blocks[0].id);
			}
		}

		return () => {
			setCurrentPanel('');
			resetAnswers();
		};
	}, []);

	return (
		<div id="quillforms-builder-page">
			{isResolving ? (
				<div
					className={css`
						display: flex;
						flex-wrap: wrap;
						width: 100%;
						min-height: 100vh;
						justify-content: center;
						align-items: center;
					`}
				>
					<Loader color="#8640e3" height={50} width={50} />
				</div>
			) : (
				<>
					{unknownBlocks?.length ? (
						<div
							className={css`
								margin: auto;
								padding: 20px;
								max-width: 400px;
								background: #9b32324d;
								color: #a71616;
							`}
						>
							{__('The following blocks aren\'t known:', 'quillforms')}
							<ul
								className={css`
									list-style: auto;
									margin-left: 20px;
								`}
							>
								{unknownBlocks.map((blockname) => (
									<li key={blockname}> {blockname} </li>
								))}
							</ul>
						</div>
					) : (
						<>
							{fullPreviewMode ? (
								<FullPreviewLayout
									setFullPreviewMode={setFullPreviewMode}
								/>
							) : (
								<BuilderLayout formId={id} isLogicRoute={isLogicRoute} />
							)}
						</>
					)}
				</>
			)}
			<FormAdminBarActions>
				<FullPreviewIcon
					isResolving={isResolving}
					setFullPreviewMode={setFullPreviewMode}
				/>
				<SaveButton formId={id} isResolving={isResolving} />
			</FormAdminBarActions>
		</div>
	);
};

export default Builder;

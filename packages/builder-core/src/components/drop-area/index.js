/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import {
	BlockEditBox,
	BlockEditErrorBoundary,
	__experimentalBlockDragging as BlockDragging,
} from '@quillforms/block-editor';
import { __experimentalDroppable as Droppable } from '@quillforms/admin-components';

/**
 * Wordpress Dependencies
 */
import { useSelect, AsyncModeProvider } from '@wordpress/data';

/**
 * External Dependencies.
 */
import classNames from 'classnames';
import { cloneDeep } from 'lodash';

const BlockDragIndexLine = () => {
	return <div className="block-drag-index-line"></div>;
};

const DropArea = ( props ) => {
	const { areaToHide, currentPanel, targetIndex, isDragging } = props;
	const { formBlocks, currentBlockId } = useSelect( ( select ) => {
		return {
			formBlocks: select( 'quillForms/block-editor' ).getBlocks(),
			currentBlockId: select(
				'quillForms/block-editor'
			).getCurrentBlockId(),
		};
	} );

	return (
		<div
			className="builder-core-drop-area"
			style={ {
				maxWidth: areaToHide
					? '60%'
					: currentPanel
					? 'calc(55% - 300px)'
					: '55%',
			} }
		>
			<Droppable
				droppableId="DROP_AREA"
				renderClone={ ( provided, _snapshot, rubric ) => {
					const item = formBlocks[ rubric.source.index ];
					return (
						<div
							{ ...provided.draggableProps }
							{ ...provided.dragHandleProps }
							ref={ provided.innerRef }
							style={ {
								...provided.draggableProps.style,
								height: undefined,
								padding: 12,
							} }
						>
							<BlockDragging id={ item.id } name={ item.name } />
						</div>
					);
				} }
			>
				{ ( provided, snapshot ) => (
					<div
						className={ classNames(
							'builder-core-drop-area__container',
							{
								'disable-hover-highlight':
									isDragging || snapshot.isDraggingOver,
							}
						) }
						{ ...provided.droppableProps }
						ref={ provided.innerRef }
						isDraggingOver={ snapshot.isDraggingOver }
					>
						{ formBlocks?.length > 0 &&
							formBlocks.map( ( item, index ) => {
								return (
									<>
										{ index === targetIndex && (
											<BlockDragIndexLine />
										) }
										<BlockEditErrorBoundary key={ item.id }>
											<BlockEditBox
												index={ index }
												id={ item.id }
												name={ item.name }
											/>
										</BlockEditErrorBoundary>
									</>
								);
							} ) }
						{ targetIndex === formBlocks.length && (
							<BlockDragIndexLine />
						) }
						{ provided.placeholder }
					</div>
				) }
			</Droppable>
		</div>
	);
};
export default DropArea;

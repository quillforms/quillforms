/**
 * QuillForms Dependencies
 */
import {
	BlockTypesListDropdown,
	__experimentalDroppable as Droppable,
} from '@quillforms/admin-components';

import { size } from 'lodash';
import { css } from 'emotion';

import BlockDragging from '../block-dragging';
import BlockListItem from '../block-list-item';
import { useSelect } from '@wordpress/data';
import classNames from 'classnames';
const BlockDragIndexLine = () => {
	return <div className="block-drag-index-line"></div>;
};

const BlockChildrenContainer = ( { id, index, innerBlocks, parentColor } ) => {
	const { formBlocks, currentChildBlockId } = useSelect( ( select ) => {
		return {
			formBlocks: select( 'quillForms/block-editor' ).getBlocks(),
			currentChildBlockId: select(
				'quillForms/block-editor'
			).getCurrentChildBlockId(),
		};
	} );
	return (
		<Droppable
			type={ `container-${ id }` }
			droppableId={ `PARENT_${ id }_${ index }` }
			renderClone={ ( provided, _snapshot, rubric ) => {
				const item =
					formBlocks[ index ]?.innerBlocks?.[ rubric.source.index ];

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
						<BlockDragging id={ item?.id } name={ item?.name } />
					</div>
				);
			} }
		>
			{ ( provided, snapshot ) => (
				<div
					className={ classNames( 'block-editor-children-container', {
						'disable-hover-highlight': snapshot.isDraggingOver,
					} ) }
					{ ...provided.droppableProps }
					ref={ provided.innerRef }
				>
					{ ! innerBlocks || size( innerBlocks ) === 0 ? (
						<div
							className={ css`
								display: flex;
								align-items: center;
								padding: 20px;
							` }
						>
							<BlockTypesListDropdown
								destinationIndex={ 0 }
								parent={ id }
								color="primary"
							/>
							<span
								className={ css`
									font-size: 14px;
								` }
							>
								Add your first question
							</span>
						</div>
					) : (
						<div>
							{ innerBlocks.map( ( block, $index ) => {
								return (
									<div
										className={ classNames(
											'block-editor-child-wrapper',
											{
												isSelected:
													block.id ===
													currentChildBlockId,
											}
										) }
										key={ block.id }
									>
										<BlockListItem
											key={ block.id }
											id={ block.id }
											name={ block.name }
											index={ $index }
											parentId={ id }
											parentIndex={ index }
										/>
										<div
											className={ classNames(
												'block-editor-child-connection-point',
												css`
													background: ${ parentColor };
												`
											) }
										></div>
									</div>
								);
							} ) }
							<div
								className={ classNames(
									'block-editor-children-connection-line',
									css`
										background: ${ parentColor };
									`
								) }
							></div>
						</div>
					) }
					{ provided.placeholder }
				</div>
			) }
		</Droppable>
	);
};
export default BlockChildrenContainer;

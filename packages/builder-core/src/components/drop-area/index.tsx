/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import {
	__experimentalBlockDragging as BlockDragging,
	__experimentalBlockListItem as BlockListItem,
} from '@quillforms/block-editor';
import { __experimentalDroppable as Droppable } from '@quillforms/admin-components';

/**
 * Wordpress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies.
 */
import classNames from 'classnames';
import DropAreaPlaceholder from '../drop-area-placeholder';

const BlockDragIndexLine = () => {
	return <div className="block-drag-index-line"></div>;
};

const DropArea = ( props ) => {
	const { areaToShow, currentPanel, targetIndex, isDragging } = props;
	const { formBlocks } = useSelect( ( select ) => {
		return {
			formBlocks: select( 'quillForms/block-editor' ).getBlocks(),
		};
	} );

	return (
		<div
			className="builder-core-drop-area"
			style={ {
				maxWidth: areaToShow
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
					>
						{ ! formBlocks || formBlocks.length === 0 ? (
							<DropAreaPlaceholder
								isDraggingOver={ snapshot.isDraggingOver }
							/>
						) : (
							<>
								{ formBlocks.map( ( item, index ) => {
									return (
										<Fragment key={ item.id }>
											{ index === targetIndex && (
												<BlockDragIndexLine />
											) }
											<BlockListItem
												index={ index }
												id={ item.id }
												name={ item.name }
											/>
										</Fragment>
									);
								} ) }
								{ targetIndex === formBlocks.length && (
									<BlockDragIndexLine />
								) }
							</>
						) }
						{ provided.placeholder }
					</div>
				) }
			</Droppable>
		</div>
	);
};
export default DropArea;

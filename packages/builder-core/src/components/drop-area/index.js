/* eslint-disable no-nested-ternary */
/**
 * QuillForms Dependencies
 */
import {
	BlockEditBox,
	BlockEditErrorBoundary,
	__experimentalBlockDragging as BlockDragging,
} from '@quillforms/block-editor';
import { __experimentalDroppable as Droppable } from '@quillforms/builder-components';

/**
 * Wordpress Dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * External Dependencies.
 */
import classNames from 'classnames';

const BlockDragIndexLine = () => {
	return <div className="block-drag-index-line"></div>;
};

const DropArea = ( props ) => {
	const {
		formStructure,
		areaToHide,
		currentPanel,
		blocks,
		targetIndex,
		isDragging,
	} = props;

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
					const item = { ...formStructure[ rubric.source.index ] };
					const block = blocks[ item.type ];
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
							<BlockDragging item={ item } block={ block } />
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
						{ formStructure &&
							formStructure.length > 0 &&
							formStructure.map( ( item, index ) => {
								const block = blocks[ item.type ];
								return (
									<>
										{ index === targetIndex && (
											<BlockDragIndexLine />
										) }
										<BlockEditErrorBoundary key={ item.id }>
											<BlockEditBox
												index={ index }
												item={ { ...item } }
												block={ block }
											/>
										</BlockEditErrorBoundary>
									</>
								);
							} ) }
						{ targetIndex === formStructure.length && (
							<BlockDragIndexLine />
						) }
						{ provided.placeholder }
					</div>
				) }
			</Droppable>
		</div>
	);
};

export default compose( [
	withSelect( ( select ) => {
		const { getBlocks } = select( 'quillForms/blocks' );
		const { getFormStructure } = select( 'quillForms/block-editor' );

		return {
			blocks: getBlocks(),
			formStructure: getFormStructure(),
		};
	} ),
] )( DropArea );

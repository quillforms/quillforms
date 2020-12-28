/* eslint-disable no-shadow */
/**
 * Internal Dependencies
 */
import Droppable from '../droppable';
import Draggable from '../draggable';
import BlocksListItem from '../blocks-list-item';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * External Dependencies
 */
import classnames from 'classnames';

const BlocksList = ( { blockTypes, welcomeScreensLength } ) => {
	return (
		<div className="builder-components-blocks-list">
			<Droppable
				droppableId="BLOCKS_LIST"
				isDropDisabled={ true }
				style={ { overflowY: 'auto' } }
			>
				{ ( provided, snapshot ) => (
					<div
						ref={ provided.innerRef }
						isDraggingOver={ snapshot.isDraggingOver }
					>
						{ Object.keys( blockTypes ).map( ( type, index ) => {
							let isDragDisabled = false;
							if (
								type === 'welcome-screen' &&
								welcomeScreensLength >= 1
							) {
								isDragDisabled = true;
							}
							return (
								<div
									key={ blockTypes[ type ].id }
									style={ { marginBottom: '20px' } }
								>
									<Draggable
										isDragDisabled={
											isDragDisabled ? true : false
										}
										draggableId={ blockTypes[ type ].id }
										index={ index }
									>
										{ ( provided, snapshot ) => (
											<Fragment>
												<div
													className={ classnames(
														'builder-components-blocks-list__item-wrapper',
														{
															'is-dragging': snapshot.isDragging
																? true
																: false,
														}
													) }
													{ ...provided.draggableProps }
													{ ...provided.dragHandleProps }
													ref={ provided.innerRef }
													isDragging={
														snapshot.isDragging
													}
													style={ {
														...provided
															.draggableProps
															.style,
													} }
												>
													<BlocksListItem
														item={
															blockTypes[ type ]
														}
														disabled={
															isDragDisabled
														}
													/>
												</div>
												{ snapshot.isDragging && (
													<div
														className={ classnames(
															'builder-components-blocks-list__item-wrapper'
														) }
													>
														<BlocksListItem
															item={
																blockTypes[
																	type
																]
															}
															disabled={
																isDragDisabled
															}
														/>
													</div>
												) }
											</Fragment>
										) }
									</Draggable>
								</div>
							);
						} ) }
						{ provided.placeholder }
					</div>
				) }
			</Droppable>
		</div>
	);
};

export default compose(
	withSelect( ( select ) => {
		const { getBlockTypes } = select( 'quillForms/blocks' );
		const { getWelcomeScreensLength } = select( 'quillForms/block-editor' );

		return {
			blockTypes: getBlockTypes(),
			welcomeScreensLength: getWelcomeScreensLength(),
		};
	} )
)( BlocksList );

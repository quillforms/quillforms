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
import { keys, map, filter } from 'lodash';

const BlocksList = ( { blockTypes, welcomeScreensLength } ) => {
	return (
		<div className="admin-components-blocks-list">
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
						{ map(
							filter(
								keys( blockTypes ),
								( blockName ) => blockName !== 'unknown'
							),
							( blockName, index ) => {
								let isDragDisabled = false;
								if (
									blockName === 'welcome-screen' &&
									welcomeScreensLength >= 1
								) {
									isDragDisabled = true;
								}

								return (
									<div
										key={ blockName }
										style={ { marginBottom: '20px' } }
									>
										<Draggable
											isDragDisabled={
												isDragDisabled ? true : false
											}
											draggableId={ blockName }
											index={ index + 1 }
										>
											{ ( provided, snapshot ) => (
												<Fragment>
													<div
														className={ classnames(
															'admin-components-blocks-list__item-wrapper',
															{
																'is-dragging': snapshot.isDragging
																	? true
																	: false,
															}
														) }
														{ ...provided.draggableProps }
														{ ...provided.dragHandleProps }
														ref={
															provided.innerRef
														}
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
																blockTypes[
																	blockName
																]
															}
															disabled={
																isDragDisabled
															}
														/>
													</div>
													{ snapshot.isDragging && (
														<div
															className={ classnames(
																'admin-components-blocks-list__item-wrapper'
															) }
														>
															<BlocksListItem
																item={
																	blockTypes[
																		blockName
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
							}
						) }
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

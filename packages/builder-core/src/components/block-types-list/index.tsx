/* eslint-disable no-shadow */
/**
 * Internal Dependencies
 */
import {
	__experimentalDraggable as Draggable,
	__experimentalDroppable as Droppable,
} from '@quillforms/admin-components';
import BlockTypesListItem from '../block-types-list-item';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { keys, map, filter } from 'lodash';
import { FC } from 'react';

const BlockTypesList: FC = () => {
	const { blockTypes, welcomeScreensLength } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
			welcomeScreensLength: select(
				'quillForms/block-editor'
			).getWelcomeScreensLength(),
		};
	} );
	return (
		<div className="admin-components-blocks-list">
			<Droppable droppableId="BLOCKS_LIST" isDropDisabled={ true }>
				{ ( provided, snapshot ) => (
					<div
						ref={ provided.innerRef }
						data-isDraggingOver={ snapshot.isDraggingOver }
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
										style={ {
											marginBottom: '20px',
											overflow: 'auto',
										} }
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
														data-isDragging={
															snapshot.isDragging
														}
														style={ {
															...provided
																.draggableProps
																.style,
														} }
													>
														<BlockTypesListItem
															blockName={
																blockName
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
															<BlockTypesListItem
																blockName={
																	blockName
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

export default BlockTypesList;

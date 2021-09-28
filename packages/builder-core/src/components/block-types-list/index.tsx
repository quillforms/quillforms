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
import { keys, map } from 'lodash';
import { FC } from 'react';

const BlockTypesList: FC = () => {
	const { blockTypes, welcomeScreensLength } = useSelect( ( select ) => {
		const blockTypes = select( 'quillForms/blocks' ).getBlockTypes();
		return {
			blockTypes,
			welcomeScreensLength: select(
				'quillForms/block-editor'
			).getWelcomeScreensLength(),
		};
	} );
	return (
		<div className="admin-components-blocks-list">
			<Droppable droppableId="BLOCKS_LIST" isDropDisabled={ true }>
				{ ( provided, _snapshot ) => (
					<div ref={ provided.innerRef }>
						{ map( keys( blockTypes ), ( blockName, index ) => {
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
										index={ index }
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
													ref={ provided.innerRef }
													style={ {
														...provided
															.draggableProps
															.style,
													} }
												>
													<BlockTypesListItem
														index={ index }
														blockName={ blockName }
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
															index={ index }
															blockName={
																blockName
															}
															disabled={
																isDragDisabled
															}
															disableAnimation={
																true
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

export default BlockTypesList;

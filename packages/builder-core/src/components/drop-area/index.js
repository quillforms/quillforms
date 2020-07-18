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
import assign from 'lodash/assign';

const DropArea = ( props ) => {
	const {
		fields,
		areaToHide,
		currentPanel,
		welcomeScreens,
		thankyouScreens,
		blocks,
	} = props;
	const list = welcomeScreens
		.map( ( welcomeScreen ) =>
			assign( { type: 'welcome-screen', ...welcomeScreen } )
		)
		.concat( fields )
		.concat(
			thankyouScreens.map( ( thankyouScreen ) =>
				assign( { type: 'thankyou-screen', ...thankyouScreen } )
			)
		);
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
					const item = list[ rubric.source.index ];
					const block = blocks[ item.type ];
					return (
						<div
							{ ...provided.draggableProps }
							{ ...provided.dragHandleProps }
							ref={ provided.innerRef }
						>
							<BlockDragging item={ item } block={ block } />
						</div>
					);
				} }
			>
				{ ( provided, snapshot ) => (
					<div
						className="builder-core-drop-area__container"
						{ ...provided.droppableProps }
						ref={ provided.innerRef }
						isDraggingOver={ snapshot.isDraggingOver }
					>
						{ list &&
							list.length > 0 &&
							list.map( ( item, index ) => {
								const block = blocks[ item.type ];
								return (
									<BlockEditErrorBoundary key={ item.id }>
										<BlockEditBox
											index={ index }
											item={ { ...item } }
											block={ block }
										/>
									</BlockEditErrorBoundary>
								);
							} ) }

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
		const { getFields, getWelcomeScreens, getThankyouScreens } = select(
			'quillForms/builder-core'
		);

		return {
			blocks: getBlocks(),
			fields: getFields(),
			welcomeScreens: getWelcomeScreens(),
			thankyouScreens: getThankyouScreens(),
		};
	} ),
] )( DropArea );

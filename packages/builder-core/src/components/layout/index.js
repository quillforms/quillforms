/**
 * QuillForms Dependencies
 */
import { __experimentalDragDropContext as DragDropContext } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useCallback, useState } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PluginArea } from '@wordpress/plugins';

/**
 * External Dependencies
 */
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import uuid from 'uuid/v4';
import { confirmAlert } from 'react-confirm-alert';

/**
 * Internal Dependencies
 */
import DropArea from '../drop-area';
// import FormPreview from '../preview-area';
import Panel from '../panel';
import BuilderPanelsBar from '../builder-panels-bar';
import DragAlert from '../drag-alert';

const Layout = ( props ) => {
	const {
		currentPanel,
		areaToHide,
		registeredBlocks,
		formStructure,
		reorderBlocks,
		insertNewFormBlock,
		// insertNewFieldAnswer,
	} = props;

	const [ targetIndex, setTargetIndex ] = useState();
	const [ isDraggingContent, setIsDraggingContent ] = useState( false );
	const [ sourceContentIndex, setSourceContentIndex ] = useState();
	const [ isDragging, setIsDragging ] = useState( false );

	const hasNextFieldVars = ( sourceIndex, destinationIndex ) => {
		const list = { ...formStructure };
		const { title, description } = list[ sourceIndex ];
		const regex = /{{field:([a-zA-Z0-9-_]+)}}/g;
		let match;

		while ( ( match = regex.exec( title + ' ' + description ) ) ) {
			const fieldId = match[ 1 ];
			const fieldIndex = formStructure.findIndex(
				( field ) => field.id === fieldId
			);
			if ( fieldIndex >= destinationIndex ) {
				return true;
			}
		}
		return false;
	};

	const onDragStart = ( { source } ) => {
		setIsDragging( true );
		if ( source?.droppableId !== 'DROP_AREA' ) return;
		setSourceContentIndex( source.index );
	};

	const onDragUpdate = ( { destination } ) => {
		if ( destination?.droppableId !== 'DROP_AREA' ) {
			setTargetIndex( undefined );
			return;
		}
		let next = destination?.index;
		if ( isDraggingContent ) {
			next = next >= sourceContentIndex ? next + 1 : next;
		}
		setTargetIndex( next );
	};

	const onDragEnd = useCallback( ( result ) => {
		setIsDragging( false );
		setTargetIndex( undefined );
		setIsDraggingContent( false );

		const { source, destination } = result;

		// dropped outside the list
		if ( ! destination ) {
			return;
		}

		switch ( source.droppableId ) {
			case destination.droppableId:
				if ( destination.droppableId === 'BLOCKS_LIST' ) {
					return;
				}
				if ( hasNextFieldVars( source.index, destination.index ) ) {
					confirmAlert( {
						customUI: ( { onClose } ) => {
							return (
								<DragAlert
									approve={ () => {
										reorderBlocks(
											source.index,
											destination.index
										);
										onClose();
									} }
									reject={ () => {
										onClose();
									} }
								/>
							);
						},
					} );
				} else {
					reorderBlocks( source.index, destination.index );
				}
				break;
			case 'BLOCKS_LIST': {
				if ( destination.droppableId === 'DROP_AREA' ) {
					// Get block type
					const blockType = Object.keys( registeredBlocks )[
						source.index
					];
					let draggedBlock = { ...registeredBlocks[ blockType ] };
					assign( draggedBlock, {
						id: uuid(),
						title: '<p></p>',
						type: blockType,
					} );
					const isBlockEditable = draggedBlock.supports?.displayOnly
						? false
						: true;
					if ( isBlockEditable === false ) {
						assign( draggedBlock, {
							required: false,
						} );
					}
					draggedBlock = omit( draggedBlock, [
						'editorConfig',
						'rendererConfig',
						'supports',
					] );

					// if ( isBlockEditable )
					// 	insertNewFieldAnswer( draggedBlock.id, blockType );

					insertNewFormBlock( draggedBlock, destination );
				}
			}
		}
	} );

	const onBeforeCapture = ( { draggableId } ) => {
		const contentListItem = formStructure.find(
			( block ) => block.id === draggableId
		);
		const isDraggingContentList = !! contentListItem;

		if ( isDraggingContentList ) {
			setIsDraggingContent( true );
		}

		const el = document.querySelector(
			`[data-rbd-draggable-id="${ draggableId }"]`
		);

		if ( el ) {
			el.style.height = isDraggingContentList ? '24px' : '2px';
		}
	};

	return (
		<DragDropContext
			onDragStart={ onDragStart }
			onDragEnd={ onDragEnd }
			onDragUpdate={ onDragUpdate }
			onBeforeCapture={ onBeforeCapture }
		>
			<PluginArea />
			<BuilderPanelsBar />
			{ currentPanel && <Panel /> }
			{ ( ! areaToHide || areaToHide !== 'drop-area' ) && (
				<DropArea
					isDragging={ isDragging }
					currentPanel={ currentPanel }
					targetIndex={ targetIndex }
					areaToHide={ areaToHide }
				/>
			) }
			{ /* { ( ! areaToHide || areaToHide !== 'preview-area' ) && (
				 <FormPreview />
			) } */ }
		</DragDropContext>
	);
};

export default compose( [
	withSelect( ( select ) => {
		const { getBlocks } = select( 'quillForms/blocks' );
		const { getCurrentPanel, getPanels, getAreaToHide } = select(
			'quillForms/builder-panels'
		);
		const { getFormStructure } = select( 'quillForms/block-editor' );
		return {
			registeredBlocks: getBlocks(),
			currentPanel: getCurrentPanel(),
			areaToHide: getAreaToHide(),
			panels: getPanels(),
			formStructure: getFormStructure(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { insertNewFormBlock, reorderFormBlocks } = dispatch(
			'quillForms/block-editor'
		);
		// const { insertNewFieldAnswer } = dispatch(
		// 	'quillForms/renderer-submission'
		// );
		return {
			insertNewFormBlock: ( block, destination ) =>
				insertNewFormBlock( block, destination ),
			reorderBlocks: ( sourceIndex, destinationIndex ) =>
				reorderFormBlocks( sourceIndex, destinationIndex ),
			// insertNewFieldAnswer: ( id, type ) =>
			// 	insertNewFieldAnswer( id, type ),
		};
	} ),
] )( Layout );

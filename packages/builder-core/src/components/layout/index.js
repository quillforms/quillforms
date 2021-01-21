/**
 * QuillForms Dependencies
 */
import { __experimentalDragDropContext as DragDropContext } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useCallback, useState, useMemo, useEffect } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { PluginArea } from '@wordpress/plugins';

/**
 * External Dependencies
 */
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import { confirmAlert } from 'react-confirm-alert';

/**
 * Internal Dependencies
 */
import DropArea from '../drop-area';
import FormPreview from '../preview-area-wrapper';
import Panel from '../panel';
import BuilderPanelsBar from '../builder-panels-bar';
import DragAlert from '../drag-alert';
import SaveButton from '../save-button';
import { BuilderNotices } from '../builder-notices';

const Layout = ( props ) => {
	const {
		currentPanel,
		areaToHide,
		blockTypes,
		formBlocks,
		reorderBlocks,
		insertBlock,
		insertNewFieldAnswer,
		hasBlocksFinishedResolution,
		setCurrentBlockId,
	} = props;

	const [ targetIndex, setTargetIndex ] = useState();
	const [ isDraggingContent, setIsDraggingContent ] = useState( false );
	const [ sourceContentIndex, setSourceContentIndex ] = useState();
	const [ isDragging, setIsDragging ] = useState( false );

	const generateBlockId = () => {
		if ( formBlocks?.length > 0 ) {
			const maxId = Math.max.apply(
				Math,
				formBlocks.map( ( o ) => o.id )
			);
			return ( maxId + 1 ).toString();
		}
		return '1';
	};

	const hasNextFieldVars = ( sourceIndex, destinationIndex ) => {
		const list = { ...formBlocks };
		const { title, description } = list[ sourceIndex ];
		const regex = /{{field:([a-zA-Z0-9-_]+)}}/g;
		let match;

		while ( ( match = regex.exec( title + ' ' + description ) ) ) {
			const fieldId = match[ 1 ];
			const fieldIndex = formBlocks.findIndex(
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

	const onDragUpdate = ( { destination, source } ) => {
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
					const blockType = Object.keys( blockTypes )[ source.index ];
					let draggedBlock = { ...blockTypes[ blockType ] };
					assign( draggedBlock, {
						id: generateBlockId(),
						title: '',
						type: blockType,
					} );
					const isBlockEditable = draggedBlock.supports?.editable;
					if ( ! isBlockEditable ) {
						assign( draggedBlock, {
							required: false,
						} );
					}
					draggedBlock = omit( draggedBlock, [
						'editorConfig',
						'rendererConfig',
						'supports',
					] );

					if ( isBlockEditable )
						insertNewFieldAnswer( draggedBlock.id, blockType );

					insertBlock( draggedBlock, destination );
				}
			}
		}
	} );

	const onBeforeCapture = ( { draggableId } ) => {
		const contentListItem = formBlocks.find(
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

	const formPreview = useMemo( () => {
		return <FormPreview />;
	}, [] );

	const pluginsArea = useMemo( () => {
		return <PluginArea />;
	}, [] );
	const builderNotices = useMemo( () => {
		return <BuilderNotices />;
	}, [] );

	const builderPanelsBar = useMemo( () => {
		return <BuilderPanelsBar />;
	}, [] );

	const savButton = useMemo( () => {
		return <SaveButton />;
	}, [] );

	// Setting current block id once blocks are resolved.
	useEffect( () => {
		if ( hasBlocksFinishedResolution && formBlocks?.length > 0 ) {
			setCurrentBlockId( formBlocks[ 0 ].id );
			formBlocks.forEach( ( block ) => {
				const blockType = blockTypes[ block.type ];
				if ( blockType.supports.editable )
					insertNewFieldAnswer( block.id, block.type );
			} );
		}
	}, [ hasBlocksFinishedResolution ] );

	return (
		<>
			{ savButton }
			{ builderNotices }
			{ pluginsArea }
			{ builderPanelsBar }
			<DragDropContext
				onDragStart={ onDragStart }
				onDragEnd={ onDragEnd }
				onDragUpdate={ onDragUpdate }
				onBeforeCapture={ onBeforeCapture }
			>
				{ currentPanel && <Panel /> }
				{ ( ! areaToHide || areaToHide !== 'drop-area' ) && (
					<DropArea
						isDragging={ isDragging }
						currentPanel={ currentPanel }
						targetIndex={ targetIndex }
						areaToHide={ areaToHide }
					/>
				) }
			</DragDropContext>
			{ ( ! areaToHide || areaToHide !== 'preview-area' ) && formPreview }
		</>
	);
};

export default compose( [
	withSelect( ( select ) => {
		const { getBlockTypes } = select( 'quillForms/blocks' );
		const { getCurrentPanel, getPanels, getAreaToHide } = select(
			'quillForms/builder-panels'
		);
		const { getBlocks, hasFinishedResolution } = select(
			'quillForms/block-editor'
		);
		return {
			blockTypes: getBlockTypes(),
			currentPanel: getCurrentPanel(),
			areaToHide: getAreaToHide(),
			panels: getPanels(),
			formBlocks: getBlocks(),
			hasBlocksFinishedResolution: hasFinishedResolution( 'getBlocks' ),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { insertBlock, reorderBlocks, setCurrentBlock } = dispatch(
			'quillForms/block-editor'
		);
		const { insertEmptyFieldAnswer } = dispatch(
			'quillForms/renderer-submission'
		);
		return {
			setCurrentBlockId: ( id ) => setCurrentBlock( id ),
			insertBlock: ( block, destination ) =>
				insertBlock( block, destination ),
			reorderBlocks: ( sourceIndex, destinationIndex ) =>
				reorderBlocks( sourceIndex, destinationIndex ),
			insertNewFieldAnswer: ( id, type ) =>
				insertEmptyFieldAnswer( id, type ),
		};
	} ),
] )( Layout );

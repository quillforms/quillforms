/**
 * QuillForms Dependencies
 */
import { __experimentalDragDropContext as DragDropContext } from '@quillforms/admin-components';
import { createBlock } from '@quillforms/blocks';
/**
 * WordPress Dependencies
 */
import { useCallback, useState, useMemo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { PluginArea } from '@wordpress/plugins';

/**
 * External Dependencies
 */
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
	const [ targetIndex, setTargetIndex ] = useState();
	const [ isDraggingContent, setIsDraggingContent ] = useState( false );
	const [ sourceContentIndex, setSourceContentIndex ] = useState();
	const [ isDragging, setIsDragging ] = useState( false );

	const {
		blockTypes,
		currentPanel,
		areaToHide,
		formBlocks,
		hasBlocksFinishedResolution,
	} = useSelect( ( select ) => {
		const { getBlockTypes } = select( 'quillForms/blocks' );
		const { getCurrentPanel, getAreaToHide } = select(
			'quillForms/builder-panels'
		);
		const { getBlocks, hasFinishedResolution } = select(
			'quillForms/block-editor'
		);
		return {
			blockTypes: getBlockTypes(),
			currentPanel: getCurrentPanel(),
			areaToHide: getAreaToHide(),
			formBlocks: getBlocks(),
			hasBlocksFinishedResolution: hasFinishedResolution( 'getBlocks' ),
		};
	} );

	const { insertBlock, reorderBlocks, setCurrentBlock } = useDispatch(
		'quillForms/block-editor'
	);
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-submission'
	);
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

	const hasIncorrectFieldMergeTags = ( a, b ) => {
		const list = [ ...formBlocks ];
		const {
			attributes: { label, description },
		} = list[ a ];
		const regex = /{{field:([a-zA-Z0-9-_]+)}}/g;
		let match;

		while ( ( match = regex.exec( label + ' ' + description ) ) ) {
			const fieldId = match[ 1 ];
			const fieldIndex = formBlocks.findIndex(
				( field ) => field.id === fieldId
			);
			if ( fieldIndex >= b ) {
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
				if (
					hasIncorrectFieldMergeTags(
						source.index,
						destination.index
					) ||
					hasIncorrectFieldMergeTags(
						destination.index,
						source.index
					)
				) {
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
									closeModal={ onClose }
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
					const blockName = Object.keys( blockTypes )[ source.index ];
					const blockType = blockTypes[ blockName ];
					const blockToInsert = createBlock( blockName );
					blockToInsert.id = generateBlockId();
					if ( blockType.supports.editable )
						insertEmptyFieldAnswer( blockToInsert.id, blockType );

					insertBlock( blockToInsert, destination );
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

	const panel = useMemo( () => {
		return <Panel />;
	}, [] );

	// Setting current block id once blocks are resolved.
	useEffect( () => {
		if ( hasBlocksFinishedResolution && formBlocks?.length > 0 ) {
			setCurrentBlock( formBlocks[ 0 ].id );
			formBlocks.forEach( ( block ) => {
				const blockType = blockTypes[ block.name ];
				if ( blockType.supports.editable )
					insertEmptyFieldAnswer( block.id, block.name );
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
				{ currentPanel && panel }
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

export default Layout;

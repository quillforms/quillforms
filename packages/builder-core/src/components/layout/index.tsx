/**
 * QuillForms Dependencies
 */
import { __experimentalDragDropContext as DragDropContext } from '@quillforms/admin-components';
import { sanitizeBlockAttributes } from '@quillforms/blocks';
import { FormBlock } from '@quillforms/types';

/**
 * WordPress Dependencies
 */
import { useState, useMemo, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { doAction, applyFilters } from '@wordpress/hooks';

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
import BuilderPanelsBar from '../panels-bar';
import DragAlert from '../drag-alert';
import type {
	OnDragUpdateResponder,
	OnDragEndResponder,
	OnBeforeCaptureResponder,
	OnDragStartResponder,
} from 'react-beautiful-dnd';

interface Props {
	formId: number;
}
const Layout: React.FC< Props > = ( { formId } ) => {
	const [ targetIndex, setTargetIndex ] = useState< number >();
	const [ isDraggingContent, setIsDraggingContent ] = useState< boolean >(
		false
	);
	const [ sourceContentIndex, setSourceContentIndex ] = useState< number >();
	const [ isDragging, setIsDragging ] = useState< boolean >( false );

	const { blockTypes, currentPanel, areaToShow, formBlocks } = useSelect(
		( select ) => {
			const { getBlockTypes } = select( 'quillForms/blocks' );
			const { getCurrentPanel, getAreaToShow } = select(
				'quillForms/builder-panels'
			);

			const { getBlocks } = select( 'quillForms/block-editor' );
			return {
				blockTypes: getBlockTypes(),
				currentPanel: getCurrentPanel(),
				areaToShow: getAreaToShow(),
				formBlocks: getBlocks(),
			};
		}
	);

	const {
		__experimentalInsertBlock,
		__experimentalReorderBlocks,
		setCurrentBlock,
	} = useDispatch( 'quillForms/block-editor' );
	const { insertEmptyFieldAnswer } = useDispatch(
		'quillForms/renderer-core'
	);

	const hasIncorrectFieldMergeTags = ( a: number, b: number ): boolean => {
		const list = [ ...formBlocks ];
		const { attributes } = list[ a ];
		const label = attributes?.label ? attributes.label : '';
		const description = attributes?.description
			? attributes.description
			: '';
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

	const generateBlockId = (): string => {
		return Math.random().toString( 36 ).substr( 2, 9 );
	};

	/**
	 * Returns a block object given its type and attributes.
	 *
	 * @param {string} name        Block name.
	 * @param {Object} attributes  Block attributes.
	 *
	 * @throws {Error} If the block type isn't registered.
	 * @return {Object?} Block object.
	 */
	const createBlock = (
		name: string,
		attributes: Record< string, unknown > = {}
	): FormBlock | void => {
		// Blocks are stored with a unique ID, the assigned type name, the block
		// attributes.
		return {
			id: generateBlockId(),
			name,
			attributes: sanitizeBlockAttributes( name, attributes ),
		};
	};
	const onDragStart: OnDragStartResponder = ( {
		source,
	}: {
		source: {
			index?: number;
			droppableId?: string;
		};
	} ) => {
		setIsDragging( true );
		if ( source?.droppableId !== 'DROP_AREA' ) return;
		setSourceContentIndex( source.index );
	};

	const onDragUpdate: OnDragUpdateResponder = ( { destination } ) => {
		if ( destination?.droppableId !== 'DROP_AREA' ) {
			setTargetIndex( undefined );
			return;
		}
		let next = destination?.index;

		if ( isDraggingContent && next && sourceContentIndex !== undefined ) {
			next = next >= sourceContentIndex ? next + 1 : next;
		}

		setTargetIndex( next );
	};

	const onDragEnd: OnDragEndResponder = ( result ) => {
		setIsDragging( false );
		setTargetIndex( undefined );
		setIsDraggingContent( false );

		const { source, destination } = result;

		// dropped outside the list or source and destination are the same
		if (
			! destination ||
			( source.index === destination.index &&
				source.droppableId === 'DROP_AREA' )
		) {
			return;
		}

		switch ( source.droppableId ) {
			case destination.droppableId:
				if ( destination.droppableId === 'BLOCKS_LIST' ) {
					return;
				}
				let dragAlerts: string[] = [];
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
					dragAlerts.push(
						'This block recalls information from previous fields.\
						 This info will be lost if you proceed with this block movement.'
					);
				}
				dragAlerts = dragAlerts.concat(
					applyFilters(
						'QuillForms.BuilderCore.BlockReorderAlerts',
						[],
						source.index,
						destination.index
					) as string[]
				);
				if ( dragAlerts.length > 0 ) {
					confirmAlert( {
						customUI: ( { onClose } ) => {
							return (
								<DragAlert
									messages={ dragAlerts }
									approve={ () => {
										doAction(
											'QuillForms.BuilderCore.BlockReorder',
											source.index,
											destination.index
										);
										__experimentalReorderBlocks(
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
					__experimentalReorderBlocks(
						source.index,
						destination.index
					);
				}
				break;
			case 'BLOCKS_LIST': {
				if ( destination.droppableId === 'DROP_AREA' ) {
					// Get block type
					const blockName = Object.keys( blockTypes )[ source.index ];
					const blockType = blockTypes[ blockName ];
					const blockToInsert = createBlock( blockName );
					if ( blockToInsert ) {
						// blockToInsert.id = generateBlockId();
						if ( blockType.supports.editable )
							insertEmptyFieldAnswer(
								blockToInsert.id,
								blockName
							);

						__experimentalInsertBlock( blockToInsert, destination );
					}
				}
			}
		}
	};

	const onBeforeCapture: OnBeforeCaptureResponder = ( { draggableId } ) => {
		const contentListItem = formBlocks.find(
			( block ) => block.id === draggableId
		);
		const isDraggingContentList = !! contentListItem;

		if ( isDraggingContentList ) {
			setIsDraggingContent( true );
		}

		const el = document.querySelector(
			`[data-rbd-draggable-id="${ draggableId }"]`
		) as HTMLInputElement;

		if ( el ) {
			el.style.height = isDraggingContentList ? '24px' : '2px';
		}
	};

	const formPreview = useMemo( () => {
		return <FormPreview formId={ formId } />;
	}, [] );

	const builderPanelsBar = useMemo( () => {
		return <BuilderPanelsBar />;
	}, [] );

	const panel = useMemo( () => {
		return <Panel />;
	}, [] );

	// Setting current block id once blocks are resolved.
	useEffect( () => {
		if ( formBlocks?.length > 0 ) {
			setCurrentBlock( formBlocks[ 0 ].id );
			formBlocks.forEach( ( block ) => {
				const blockType = blockTypes[ block.name ];
				if ( blockType.supports.editable )
					insertEmptyFieldAnswer( block.id, block.name );
			} );
		}
	}, [] );

	return (
		<div
			className="builder-core-layout"
			onKeyDown={ ( e ) => e.stopPropagation() }
		>
			{ builderPanelsBar }
			<DragDropContext
				onDragStart={ onDragStart }
				onDragEnd={ onDragEnd }
				onDragUpdate={ onDragUpdate }
				onBeforeCapture={ onBeforeCapture }
			>
				{ currentPanel && panel }
				{ ( ! areaToShow || areaToShow === 'drop-area' ) && (
					<DropArea
						isDragging={ isDragging }
						currentPanel={ currentPanel }
						targetIndex={ targetIndex }
						areaToShow={ areaToShow }
					/>
				) }
			</DragDropContext>
			{ ( ! areaToShow || areaToShow === 'preview-area' ) && formPreview }
		</div>
	);
};

export default Layout;

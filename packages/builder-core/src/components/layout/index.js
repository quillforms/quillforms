/**
 * QuillForms Dependencies
 */
import { __experimentalDragDropContext as DragDropContext } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useCallback } from '@wordpress/element';
import { withSelect, withDispatch } from '@wordpress/data';
import { compose } from '@wordpress/compose';

/**
 * External Dependencies
 */
import omit from 'lodash/omit';
import assign from 'lodash/assign';
import uuid from 'uuid/v4';
import { confirmAlert } from 'react-confirm-alert'; // Import
//import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 * Internal Dependencies
 */
import DropArea from '../drop-area';
// import FormPreview from '../preview-area';
import Panel from '../panel';
import PanelNavbar from '../panel-navbar';

const Layout = ( props ) => {
	const { currentPanel, areaToHide, registeredBlocks, formStructure } = props;
	const hasNextFieldVars = ( sourceIndex, destinationIndex ) => {
		const list = formStructure.welcomeScreens
			.concat( formStructure.fields )
			.concat( formStructure.thankyouScreens );
		const { title, description } = list[ sourceIndex ];
		const regex = /{{field:([a-zA-Z0-9-_]+)}}/g;
		let match;

		while ( ( match = regex.exec( title + ' ' + description ) ) ) {
			const fieldId = match[ 1 ];
			const fieldIndex = formStructure.fields.findIndex(
				( field ) => field.id === fieldId
			);
			if ( fieldIndex >= destinationIndex ) {
				return true;
			}
		}
		return false;
	};

	const onDragEnd = useCallback( ( result ) => {
		const { source, destination } = result;

		// dropped outside the list
		if ( ! destination ) {
			return;
		}

		const {
			reorderBlocks,
			insertNewFormBlock,
			insertEmptyFieldAnswer,
		} = props;

		switch ( source.droppableId ) {
			case destination.droppableId:
				if ( destination.droppableId === 'BLOCKS_LIST' ) {
					return;
				}
				if ( hasNextFieldVars( source.index, destination.index ) ) {
					confirmAlert( {
						customUI: ( { onClose } ) => {
							return (
								<div
									className="alert__dialogWrapper"
									style={ {
										maxWidth: '600px',
										borderRadius: '6px',
										boxShadow:
											'0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)',
									} }
								>
									<div className="alert__dialog">
										<DialogTitle
											id={ `alert-dialog-title` }
										>
											Warning!
										</DialogTitle>
										<DialogContent className="dialog__content">
											<DialogContentText>
												This block recalls information
												from previous fields. This info
												will be lost if you proceed with
												this block movement.
												<br />
												<br /> Are you sure you want to
												proceed?
											</DialogContentText>
										</DialogContent>
										<DialogActions>
											<Button
												className="dialog__cancel__button"
												onClick={ () => {
													onClose();
												} }
												color="secondary"
											>
												Cancel
											</Button>
											<Button
												className="dialog__danger__button"
												onClick={ () => {
													reorderBlocks(
														source.index,
														destination.index
													);
													onClose();
												} }
												color="primary"
											>
												Ok
											</Button>
										</DialogActions>
									</div>
								</div>
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
					} );
					if ( draggedBlock.supports?.displayOnly === false ) {
						assign( draggedBlock, {
							required: false,
						} );
					}
					draggedBlock = omit( draggedBlock, [
						'editorConfig',
						'rendererConfig',
						'supports',
					] );

					const blockCat =
						// eslint-disable-next-line no-nested-ternary
						blockType === 'welcome-screen'
							? 'welcomeScreens'
							: blockType === 'thankyou-screen'
							? 'thankyouScreens'
							: 'fields';

					if ( blockCat === 'fields' ) {
						assign( draggedBlock, {
							type: blockType,
						} );
						if ( ! draggedBlock.displayOnly )
							insertEmptyFieldAnswer(
								draggedBlock.id,
								blockType
							);
					}
					insertNewFormBlock( draggedBlock, destination, blockCat );
				}
			}
		}
	} );

	return (
		<DragDropContext onDragEnd={ onDragEnd }>
			<PanelNavbar />
			{ currentPanel && <Panel /> }
			{ ( ! areaToHide || areaToHide !== 'drop-area' ) && (
				<DropArea areaToHide={ areaToHide } />
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
		const { getFormStructure } = select( 'quillForms/builder-core' );
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
			'quillForms/builder-core'
		);
		const { insertEmptyFieldAnswer } = dispatch(
			'quillForms/render/answers'
		);
		return {
			insertNewFormBlock: ( block, destination, category ) =>
				insertNewFormBlock( block, destination, category ),
			reorderBlocks: ( sourceIndex, destinationIndex ) =>
				reorderFormBlocks( sourceIndex, destinationIndex ),
			insertEmptyFieldAnswer: ( id, type ) =>
				insertEmptyFieldAnswer( id, type ),
		};
	} ),
] )( Layout );

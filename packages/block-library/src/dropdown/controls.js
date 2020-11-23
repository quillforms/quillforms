/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	Button,
	__experimentalDragDropContext,
	__experimentalDroppable,
} from '@quillforms/builder-components';

/**
 * WordPress Dependecies
 */
import { Fragment, useState, useRef, useMemo } from '@wordpress/element';

/**
 * External Dependencies
 */
import { FixedSizeList as List } from 'react-window';
import Checkbox from '@material-ui/core/Checkbox';
import uuid from 'uuid/v4';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import { ChoiceContextProvider } from './choices-context';
import ChoiceWrapper from './choice-wrapper';
import ChoiceRow from './choice-row';

const DropdownControls = ( props ) => {
	const {
		id,
		attributes: { choices, setScore },
		setAttributes,
	} = props;
	const [ bulkDialogOpen, setBulkDialogOpen ] = useState( false );
	const [ bulkChoicesTxt, setBulkChoicesTxt ] = useState( '' );
	const bulkTextAreaRef = useRef();

	const insertBulkChoices = () => {
		const $choices = [ ...choices ];

		bulkChoicesTxt
			.trim()
			.split( '\n' )
			.forEach( ( item ) => {
				$choices.push( { ref: uuid(), label: item, score: 0 } );
			} );
		setAttributes( { choices: $choices } );
		setBulkDialogOpen( false );
	};

	const labelChangeHandler = ( val, index ) => {
		const $choices = [ ...choices ];
		$choices[ index ] = { ...$choices[ index ], label: val };
		setAttributes( { choices: $choices } );
	};

	const scoreChangeHandler = ( val, index ) => {
		const $choices = [ ...choices ];
		$choices[ index ] = { ...$choices[ index ], score: parseInt( val ) };
		setAttributes( { choices: $choices } );
	};

	const addChoice = ( at ) => {
		const $choices = [ ...choices ];
		$choices.splice( at, 0, {
			ref: uuid(),
			label: '',
			score: 0,
		} );
		setAttributes( { choices: $choices } );
	};

	const deleteChoice = ( ref ) => {
		const index = choices.findIndex( ( choice ) => choice.ref === ref );
		const $choices = [ ...choices ];
		$choices.splice( index, 1 );
		setAttributes( { choices: $choices } );
	};

	const context = {
		addChoice,
		labelChangeHandler,
		scoreChangeHandler,
		deleteChoice,
		setScore,
	};
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Choices" />
					<div>
						<Checkbox
							checked={ setScore }
							onClick={ () => {
								setAttributes( { setScore: ! setScore } );
							} }
							size="small"
						/>
						Set Score
					</div>
				</__experimentalControlWrapper>
				<__experimentalControlWrapper orientation="vertical">
					<__experimentalDragDropContext
						onDragEnd={ ( result ) => {
							const { source, destination } = result;
							if (
								! result.destination ||
								result.source.index === result.destination.index
							) {
								return;
							}

							const sourceIndex = source.index;
							const destinationIndex = destination.index;
							const $choices = [ ...choices ];
							const output = Array.from( $choices );
							const [ removed ] = output.splice( sourceIndex, 1 );
							output.splice( destinationIndex, 0, removed );
							setAttributes( {
								choices: output,
							} );
						} }
					>
						<ChoiceContextProvider
							// It is important to return the same object if props haven't
							// changed to avoid  unnecessary rerenders.
							// See https://reactjs.org/docs/context.html#caveats.
							value={ useMemo(
								() => context,
								Object.values( context )
							) }
						>
							{ setScore && (
								<div className="qf-block-dropdown__choices-header">
									<div> Label </div>
									<div> Score</div>
								</div>
							) }
							<__experimentalDroppable
								droppableId="CHOICES_DROP_AREA"
								mode="virtual"
								renderClone={ (
									provided,
									snapshot,
									rubric
								) => {
									return (
										<div
											{ ...provided.draggableProps }
											{ ...provided.dragHandleProps }
											ref={ provided.innerRef }
											style={ {
												...provided.draggableProps
													.style,
											} }
										>
											<ChoiceRow
												choices={ choices }
												index={ rubric.source.index }
												provided={ provided }
											/>
										</div>
									);
								} }
							>
								{ ( provided, snapshot ) => {
									const itemCount = snapshot.isUsingPlaceholder
										? choices.length + 1
										: choices.length;

									return (
										<div
											ref={ provided.innerRef }
											{ ...provided.droppableProps }
										>
											<List
												className="qf-block-dropdown__choices-wrapper"
												outerRef={ provided.innerRef }
												height={ 250 }
												width={ '100%' }
												itemCount={ itemCount }
												itemSize={ 54 }
												itemData={ choices }
											>
												{ ChoiceWrapper }
											</List>
										</div>
									);
								} }
							</__experimentalDroppable>
						</ChoiceContextProvider>
					</__experimentalDragDropContext>
					<Button
						isSecondary
						isDefault
						className={ css`
							display: inline-block;
							background: #000;
							color: #fff;
							padding: 5px;
							margin-top: 12px;
						` }
						onClick={ () => setBulkDialogOpen( true ) }
					>
						<div className="buttonText">Bulk Answers</div>
					</Button>
				</__experimentalControlWrapper>
			</__experimentalBaseControl>

			<Dialog
				onRendered={ () => {
					setBulkChoicesTxt( '' );
					bulkTextAreaRef.current.focus();
				} }
				open={ bulkDialogOpen }
				onClose={ () => setBulkDialogOpen( false ) }
				aria-labelledby={ 'bulk-choices-dialog-' + id }
				aria-describedby={ 'bulk-choices-dialog-description-' + id }
			>
				<h3 className="dialog__heading">Add Answers in Bulk</h3>
				<DialogContent className="dialog__content">
					<DialogContentText
						id={ 'bulk-choices-dialog-description-' + id }
					>
						<span
							style={ {
								display: 'block',
								color: '#333',
								fontSize: '14px',
								padding: '10px 0',
							} }
						>
							<strong>
								Insert each answer choice in a separate line{ ' ' }
							</strong>
						</span>
						<textarea
							ref={ bulkTextAreaRef }
							className="bulk-choices-textarea"
							onChange={ ( e ) =>
								setBulkChoicesTxt( e.target.value )
							}
							value={ bulkChoicesTxt }
						/>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={ () => insertBulkChoices() }
						className="dialog__ok__button"
					>
						Ok
					</Button>
					<Button
						className="dialog__cancel__button"
						onClick={ () => setBulkDialogOpen( false ) }
						color="primary"
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
export default DropdownControls;

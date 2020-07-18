/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/builder-components';

/**
 * WordPress Dependecies
 */
import { Fragment, useState, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import AddIcon from '@material-ui/icons/Add';
import Input from '@material-ui/core/Input';
import uuid from 'uuid/v4';
import Button from '@material-ui/core/Button';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const DropdownControls = ( props ) => {
	const {
		id,
		attributes: { choices },
		setAttributes,
	} = props;
	const [ deleteDialogOpen, setDeleteDialogOpen ] = useState( false );
	const [ bulkDialogOpen, setBulkDialogOpen ] = useState( false );
	const [ toBeDeletedChoice, setToBeDeletedChoice ] = useState( null );
	const [ bulkChoicesTxt, setBulkChoicesTxt ] = useState( '' );
	const bulkTextAreaRef = useRef();
	const handleClose = () => {
		setDeleteDialogOpen( false );
	};

	const insertBulkChoices = () => {
		bulkChoicesTxt
			.trim()
			.split( '\n' )
			.forEach( ( item ) => {
				choices.push( { ref: uuid(), label: item } );
			} );
		setAttributes( { choices } );
		setBulkDialogOpen( false );
	};

	const choiceChangeHandler = ( e, index ) => {
		choices[ index ].label = e.target.value;
		setAttributes( { choices } );
	};

	const addNewChoice = () => {
		choices.push( { ref: uuid(), label: '' } );
		setAttributes( { choices } );
	};

	const choiceRemoveHandler = ( ref ) => {
		const index = choices.findIndex( ( choice ) => choice.ref === ref );
		choices.splice( index, 1 );
		setAttributes( { choices } );
		handleClose();
	};

	const choicesMap = choices.map( ( choice, index ) => {
		return (
			<div key={ choice.ref } className="d-flex">
				<div className="block-text-input-wrapper">
					<Input
						type="text"
						placeholder="choice"
						value={ choice.label }
						onChange={ ( e ) => choiceChangeHandler( e, index ) }
					/>
				</div>
				{ choices.length > 1 && (
					<div className="choice-remove-wrapper">
						<RemoveIcon
							onClick={ () => {
								setToBeDeletedChoice( choice.ref );
								setDeleteDialogOpen( true );
							} }
						/>
					</div>
				) }
			</div>
		);
	} );
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Choices" />
					<div>
						<button
							className="bulkAnswers__btn"
							onClick={ () => setBulkDialogOpen( true ) }
						>
							<div className="buttonText">Bulk Answers</div>
						</button>
					</div>
				</__experimentalControlWrapper>
				{ choicesMap }
				<div className="add-new-choice-btn">
					<Button
						variant="contained"
						color="primary"
						onClick={ addNewChoice }
					>
						<AddIcon />
						<div className="buttonText">Add New</div>
					</Button>
				</div>
			</__experimentalBaseControl>
			<Dialog
				open={ deleteDialogOpen }
				onClose={ handleClose }
				aria-labelledby={ 'delete-choice-dialog-' + id }
				aria-describedby={ 'delete-choice-dialog-description-' + id }
			>
				<DialogContent className="dialog__content">
					<DialogContentText
						id={ 'delete-choice-dialog-description-' + id }
					>
						Are you sure you would like to delete this choice?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						className="dialog__ok__button"
						onClick={ () =>
							choiceRemoveHandler( toBeDeletedChoice )
						}
						color="primary"
					>
						Ok
					</Button>
					<Button
						className="dialog__cancel__button"
						onClick={ handleClose }
						color="primary"
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
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

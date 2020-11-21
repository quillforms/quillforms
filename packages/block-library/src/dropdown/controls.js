/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
	Button,
	TextControl,
} from '@quillforms/builder-components';

/**
 * WordPress Dependecies
 */
import { Fragment, useState, useRef } from '@wordpress/element';

/**
 * External Dependencies
 */
import AddIcon from '@material-ui/icons/Add';
import uuid from 'uuid/v4';
import RemoveIcon from '@material-ui/icons/Remove';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { css } from 'emotion';

const DropdownControls = ( props ) => {
	const {
		id,
		attributes: { choices },
		setAttributes,
	} = props;
	const [ bulkDialogOpen, setBulkDialogOpen ] = useState( false );
	const [ bulkChoicesTxt, setBulkChoicesTxt ] = useState( '' );
	const bulkTextAreaRef = useRef();

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

	const choiceChangeHandler = ( val, index ) => {
		choices[ index ].label = val;
		setAttributes( { choices } );
	};

	const addNewChoice = () => {
		choices.push( { value: '', label: '' } );
		setAttributes( { choices } );
	};

	const choiceRemoveHandler = ( ref ) => {
		const index = choices.findIndex( ( choice ) => choice.ref === ref );
		choices.splice( index, 1 );
		setAttributes( { choices } );
	};

	const choicesMap = choices.map( ( choice, index ) => {
		return (
			<div
				key={ choice.ref }
				className="qf-block-dropdown__choice-wrapper"
			>
				<TextControl
					className={ css`
						width: 100%;
					` }
					value={ choice.label }
					setValue={ ( val ) => choiceChangeHandler( val, index ) }
				/>
				<div className="qf-block-dropdown__choice-actions">
					<div className="qf-block-dropdown__choice-add">
						<AddIcon onClick={ addNewChoice } />
					</div>
					{ choices.length > 1 && (
						<div className="qf-block-dropdown__choice-remove">
							<RemoveIcon
								onClick={ () => {
									choiceRemoveHandler( choice.ref );
								} }
							/>
						</div>
					) }
				</div>
			</div>
		);
	} );
	return (
		<Fragment>
			<__experimentalBaseControl>
				<__experimentalControlWrapper orientation="horizontal">
					<__experimentalControlLabel label="Choices" />
				</__experimentalControlWrapper>
				<__experimentalControlWrapper orientation="vertical">
					<div className="qf-block-dropdown__choices-wrapper">
						{ choicesMap }
					</div>
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

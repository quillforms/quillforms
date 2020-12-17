/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
/**
 * External Dependencies
 */
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const DragAlertModal = ( { approve, reject } ) => {
	const [ isOpen, setIsOpen ] = useState( true );

	const closeDialog = () => {
		setIsOpen( false );
	};
	return (
		<Dialog
			className="block-editor-block-edit__alert"
			open={ isOpen }
			onClose={ () => {
				closeDialog();
				reject();
			} }
			aria-labelledby={ 'Warning' }
			aria-describedby={ 'Warning' }
		>
			<div className="alert__dialog">
				<DialogTitle id={ `alert-dialog-title` }>Warning!</DialogTitle>
				<DialogContent className="dialog__content">
					<DialogContentText>
						This block recalls information from previous fields.
						This info will be lost if you proceed with this block
						movement.
						<br />
						<br /> Are you sure you want to proceed?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						isLarge
						isSecondary
						onClick={ () => {
							reject();
							closeDialog();
						} }
					>
						Cancel
					</Button>
					<Button
						isLarge
						isDanger
						className="dialog__danger__button"
						onClick={ () => {
							approve();
							closeDialog();
						} }
						color="primary"
					>
						Ok
					</Button>
				</DialogActions>
			</div>
		</Dialog>
	);
};

export default DragAlertModal;

const state = {
	currentBlockId: '',
	nextBlockId: '',
	prevBlockId: '',
	lastActiveBlock: '',
};

import { v4 as uuid } from 'uuid';
import { useState } from '@wordpress/element';
import Button from '../button';
import BulkChoicesModal from './modal';
import { css } from 'emotion';
const ChoicesBulkBtn = ( { choices, setChoices } ) => {
	const [ modalOpen, setModalOpen ] = useState( false );
	const insertBulkChoices = ( txt ) => {
		const $choices = [ ...choices ];

		txt.trim()
			.split( '\n' )
			.forEach( ( item ) => {
				$choices.push( { value: uuid(), label: item } );
			} );
		setChoices( $choices );
	};
	return (
		<div className="admin-components-choices-bulk-btn">
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
				onClick={ () => setModalOpen( true ) }
			>
				Bulk Answers
			</Button>
			{ modalOpen && (
				<BulkChoicesModal
					onInsert={ ( txt ) => insertBulkChoices( txt ) }
					closeModal={ () => setModalOpen( false ) }
				/>
			) }
		</div>
	);
};

export default ChoicesBulkBtn;

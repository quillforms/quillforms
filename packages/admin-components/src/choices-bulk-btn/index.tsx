/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { v4 as uuid } from 'uuid';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import Button from '../button';
import BulkChoicesModal from './modal';
import type { Choices } from './types';

interface Props {
	choices: Choices;
	setChoices: ( val: Choices ) => void;
}
const ChoicesBulkBtn: React.FC< Props > = ( { choices, setChoices } ) => {
	const [ modalOpen, setModalOpen ] = useState< boolean >( false );
	const insertBulkChoices = ( txt: string ) => {
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
					onInsert={ ( txt: string ) => insertBulkChoices( txt ) }
					onCloseModal={ () => setModalOpen( false ) }
				/>
			) }
		</div>
	);
};

export default ChoicesBulkBtn;

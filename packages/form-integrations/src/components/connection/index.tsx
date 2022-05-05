/**
 * QuillForms Dependencies.
 */
import { Button, TextControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import DeleteIcon from './delete-icon';

type Data = {
	name: string;
};

interface Props {
	data: Data;
	onUpdate: ( data: Data ) => void;
	onDelete: () => void;
	children: React.ReactNode;
}

const Connection: React.FC< Props > = ( {
	data,
	onUpdate,
	onDelete,
	children,
} ) => {
	return (
		<div className="integration-connection">
			<div className="integration-connection__header">
				<TextControl
					label={ __( 'Connection Name', 'quillforms' ) }
					value={ data.name }
					onChange={ ( value ) => onUpdate( { name: value } ) }
				/>
				<Button
					className="integration-connection__header-delete"
					onClick={ onDelete }
				>
					{ __( 'Delete Connection', 'quillforms' ) }
					<DeleteIcon />
				</Button>
			</div>
			<br />
			{ children }
		</div>
	);
};

export default Connection;

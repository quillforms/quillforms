/**
 * QuillForms Dependencies
 */
import { getHistory, getNewPath, useParams } from '@quillforms/navigation';
import { Button } from '@quillforms/admin-components';

/**
 * External Dependencies
 */
import { css } from 'emotion';
const ConnectButton = ( { slug } ) => {
	const { id } = useParams();
	return (
		<Button
			className={ css`
				margin-top: 15px;
				border-radius: 20px !important;
			` }
			isPrimary
			onClick={ () => {
				getHistory().push(
					getNewPath( {}, `/forms/${ id }/integrations/${ slug }` )
				);
			} }
		>
			Connect
		</Button>
	);
};

export default ConnectButton;

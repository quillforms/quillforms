/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';

const IsSavingBtn = () => {
	const { setShouldBeSaved } = useDispatch( 'quillForms/theme-editor' );
	useEffect( () => {
		return () => setShouldBeSaved( false );
	}, [] );
	return <Button isPrimary>Saving ...</Button>;
};
export default IsSavingBtn;

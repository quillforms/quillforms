/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const IsSavingBtn = () => {
	const { setShouldBeSaved } = useDispatch( 'quillForms/theme-editor' );
	useEffect( () => {
		return () => setShouldBeSaved( false );
	}, [] );
	return (
		<Button
			isPrimary
			disabled
			className="theme-editor-customize-footer__btn theme-editor-customize-footer__btn--save theme-editor-customize-footer__btn--saving"
		>
			{__('Saving…', 'quillforms')}
		</Button>
	);
};
export default IsSavingBtn;

/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getRestFields } from '@quillforms/rest-fields';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { pickBy } from 'lodash';

const SaveButton = () => {
	const isSaving = true;
	// const { isSaving, hasUnsavedChanges, postId } = useSelect( ( select ) => {
	// 	return {
	// 		isSaving: select( 'quillForms/builder-core' ).isSaving(),
	// 		hasUnsavedChanges: select(
	// 			'quillForms/builder-core'
	// 		).hasUnsavedChanges(),
	// 		postId: select( 'quillForms/builder-core' ).getPostId(),
	// 	};
	// } );

	const restFields = pickBy( getRestFields(), ( restField ) => {
		return restField.selectValue();
	} );
	const postId = '';
	return (
		<Button
			isButton
			isPrimary={ true }
			isSecondary={ false }
			isLarge
			className="qf-builder-save-button"
			onClick={ () => {
				// setIsSaving( true );

				apiFetch( {
					// Timestamp arg allows caller to bypass browser caching, which is
					// expected for this specific function.
					path:
						`/wp/v2/quill_forms/${ postId }` +
						`?context=edit&_timestamp=${ Date.now() }`,
					method: 'POST',
					data: {
						...restFields,
					},
				} ).then( () => {
					// setIsSaving( false );
				} );
			} }
		>
			{ isSaving ? 'Saving' : 'Publish' }
		</Button>
	);
};

export default SaveButton;

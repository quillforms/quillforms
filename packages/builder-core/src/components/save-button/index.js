/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/builder-components';
import { getRestFields } from '@quillforms/rest-fields';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { zipObject } from 'lodash';

const SaveButton = () => {
	console.log( getRestFields() );
	const { isSaving, hasUnsavedChanges, postId } = useSelect( ( select ) => {
		return {
			isSaving: select( 'quillForms/builder-core' ).isSaving(),
			hasUnsavedChanges: select(
				'quillForms/builder-core'
			).hasUnsavedChanges(),
			postId: select( 'quillForms/builder-core' ).getPostId(),
		};
	} );

	const { restFields } = useSelect( ( select ) => {
		return {
			restFields: zipObject(
				getRestFields().map( ( restField ) => restField.name ),
				getRestFields().map( ( restField ) =>
					restField.getValue( select )
				)
			),
		};
	} );

	const { setIsSaving } = useDispatch( 'quillForms/builder-core' );
	return (
		<Button
			isButton
			isPrimary={ isSaving ? false : true }
			isSecondary={ isSaving ? true : false }
			isLarge
			className="builder-core-save-button"
			onClick={ () => {
				setIsSaving( true );

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
				} ).then( ( res ) => {
					console.log( res );
					setIsSaving( false );
				} );
			} }
		>
			{ isSaving ? 'Saving' : 'Publish' }
		</Button>
	);
};

export default SaveButton;

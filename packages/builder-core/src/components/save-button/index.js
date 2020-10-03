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
	const { isSaving, hasUnsavedChanges } = useSelect( ( select ) => {
		return {
			isSaving: select( 'quillForms/builder-core' ).isSaving(),
			hasUnsavedChanges: select(
				'quillForms/builder-core'
			).hasUnsavedChanges(),
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

	console.log( restFields );
	const { setIsSaving } = useDispatch( 'quillForms/builder-core' );
	return (
		<Button
			isButton
			isPrimary
			isLarge
			className="builder-core-save-button"
			onClick={ () => {
				setIsSaving( true );

				apiFetch( {
					// Timestamp arg allows caller to bypass browser caching, which is
					// expected for this specific function.
					path:
						`/wp/v2/quill_forms/1339` +
						`?context=edit&_timestamp=${ Date.now() }`,
					method: 'POST',
					data: {
						...restFields,
					},
				} );
				setTimeout( () => {
					setIsSaving( false );
				}, 500 );
			} }
		>
			{ isSaving ? 'Saving' : 'Publish' }
		</Button>
	);
};

export default SaveButton;

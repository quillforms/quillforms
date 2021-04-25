/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getRestFields } from '@quillforms/rest-fields';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { mapKeys } from 'lodash';

const SaveButton = ( { formId, isFetching } ) => {
	const [ isSaving, setIsSaving ] = useState( false );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);
	const { restFields } = useSelect( ( _select ) => {
		let restFields = {};
		Object.keys( getRestFields() ).forEach( ( restFieldKey ) => {
			restFields[ restFieldKey ] = getRestFields()[
				restFieldKey
			].selectValue();
		} );
		return { restFields };
	} );

	console.log( restFields );
	return (
		<>
			{ ! isFetching && (
				<Button
					isButton
					isPrimary={ true }
					isSecondary={ false }
					isLarge
					className="qf-builder-save-button"
					onClick={ () => {
						if ( isSaving ) return;
						console.log( restFields );
						setIsSaving( true );

						apiFetch( {
							// Timestamp arg allows caller to bypass browser caching, which is
							// expected for this specific function.
							path:
								`/wp/v2/quill_forms/${ formId }` +
								`?context=edit&_timestamp=${ Date.now() }`,
							method: 'POST',
							data: {
								...restFields,
								status: 'publish',
							},
						} )
							.then( () => {
								createSuccessNotice( '🚀 Saved successfully!', {
									type: 'snackbar',
									isDismissible: true,
								} );

								setIsSaving( false );
							} )
							.catch( () => {
								createErrorNotice( '🙁 Error while saving!', {
									type: 'snackbar',
									isDismissible: true,
								} );
								setIsSaving( false );
							} );
					} }
				>
					{ isSaving ? 'Saving' : 'Publish' }
				</Button>
			) }
		</>
	);
};

export default SaveButton;

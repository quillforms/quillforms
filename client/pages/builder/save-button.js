/**
 * QuillForms Dependencies
 */
import { Button } from '@quillforms/admin-components';
import { getRestFields } from '@quillforms/rest-fields';
import { getHistory, NavigationPrompt } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { useSelect, useDispatch } from '@wordpress/data';
import { createPortal, useState, useEffect } from '@wordpress/element';

/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import PlaceholderButton from './placeholder-button';
import ConfirmNavigationModal from './confirm-navigation-modal';

const SaveButton = ( { formId, isResolving } ) => {
	const [ isSaving, setIsSaving ] = useState( false );
	const [ shouldBeSaved, setShouldBeSaved ] = useState( false );
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

	const { hasThemesFinishedResolution } = useSelect( ( select ) => {
		const { hasFinishedResolution } = select( 'quillForms/theme-editor' );

		return {
			hasThemesFinishedResolution: hasFinishedResolution(
				'getThemesList'
			),
		};
	} );

	useEffect( () => {
		if ( shouldBeSaved ) {
			window.onbeforeunload = () => true;
		} else {
			window.onbeforeunload = undefined;
		}

		return () => ( window.onbeforeunload = undefined );
	}, [ shouldBeSaved ] );

	useEffect( () => {
		if ( ! isResolving && hasThemesFinishedResolution ) {
			setShouldBeSaved( true );
		}
	}, [ JSON.stringify( restFields ) ] );

	return (
		<>
			{ createPortal(
				<>
					{ ! isResolving && hasThemesFinishedResolution ? (
						<>
							<NavigationPrompt when={ shouldBeSaved }>
								{ ( { onConfirm, onCancel } ) => (
									<ConfirmNavigationModal
										onCancel={ onCancel }
										onConfirm={ onConfirm }
									/>
								) }
							</NavigationPrompt>
							<Button
								isPrimary={ true }
								isLarge
								className={ classnames(
									'qf-builder-save-button',
									{
										disabled: ! shouldBeSaved,
									}
								) }
								onClick={ () => {
									if ( isSaving || ! shouldBeSaved ) return;
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
											createSuccessNotice(
												'🚀 Saved successfully!',
												{
													type: 'snackbar',
													isDismissible: true,
												}
											);

											setIsSaving( false );
											setShouldBeSaved( false );
										} )
										.catch( () => {
											createErrorNotice(
												'⛔ Error while saving!',
												{
													type: 'snackbar',
													isDismissible: true,
												}
											);
											setIsSaving( false );
										} );
								} }
							>
								{ isSaving ? 'Saving' : 'Publish' }
							</Button>
						</>
					) : (
						<PlaceholderButton />
					) }
				</>,
				document.body
			) }
		</>
	);
};

export default SaveButton;

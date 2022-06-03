/**
 * QuillForms Dependencies
 */
import { getNewPath, getHistory } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { DropdownMenu, MenuItem, MenuGroup } from '@wordpress/components';
import { moreHorizontal } from '@wordpress/icons';
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
import { css } from 'emotion';

const FormActions = ( { form, formId, setIsLoading } ) => {
	const { deleteEntityRecord } = useDispatch( 'core' );
	const { createErrorNotice, createSuccessNotice } = useDispatch(
		'core/notices'
	);
	const { invalidateResolution } = useDispatch( 'core/data' );

	const duplicate = async () => {
		const data = new FormData();
		data.append( 'action', 'quillforms_duplicate_form' );
		data.append( 'form_id', formId );

		await fetch( `${ window[ 'qfAdmin' ].adminUrl }admin-ajax.php`, {
			method: 'POST',
			credentials: 'same-origin',
			body: data,
		} )
			.then( ( res ) => res.json() )
			.then( ( res ) => {
				if ( res.success ) {
					invalidateResolution( 'core', 'getEntityRecords', [
						'postType',
						'quill_forms',
						{
							status: 'publish,draft',
							per_page: -1,
						},
					] );
				} else {
					createErrorNotice( `⛔ Can't duplicate form`, {
						type: 'snackbar',
						isDismissible: true,
					} );
				}
			} )
			.catch( ( err ) => {
				createErrorNotice( `⛔ ${ err ?? 'Error' }`, {
					type: 'snackbar',
					isDismissible: true,
				} );
			} );
	};

	return (
		<div
			role="presentation"
			className="quillforms-home-form-actions"
			onClick={ ( e ) => e.stopPropagation() }
		>
			<DropdownMenu
				icon={ moreHorizontal }
				popoverProps={ {
					position: 'bottom left',
				} }
				className="quillforms-home-form-actions__dropdown"
			>
				{ ( { onClose } ) => (
					<MenuGroup className="quillforms-home-form-actions__menu-group">
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${ formId }/builder`
									)
								);
							} }
						>
							Edit
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ async () => {
								setIsLoading( true );
								await duplicate();
								setIsLoading( false );
								onClose();
							} }
						>
							Duplicate
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${ formId }/results`
									)
								);
							} }
						>
							Results
						</MenuItem>
						<MenuItem
							className="quillforms-home-form-actions__menu-item"
							onClick={ () => {
								const history = getHistory();
								history.push(
									getNewPath(
										{},
										`/forms/${ formId }/integrations`
									)
								);
							} }
						>
							Integrations
						</MenuItem>

						<MenuItem
							className={ classnames(
								'quillforms-home-form-actions__menu-item quillforms-home-form-actions__delete-form',
								css`
									.components-menu-item__item {
										color: #b71717 !important;
									}
								`
							) }
							onClick={ async () => {
								setIsLoading( true );
								const res = await deleteEntityRecord(
									'postType',
									'quill_forms',
									formId
								);
								if ( ! res ) {
									createErrorNotice(
										'⛔ Errror in form deletion!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
									setIsLoading( false );
								} else {
									createSuccessNotice(
										'✅ Form moved to trash successfully!',
										{
											type: 'snackbar',
											isDismissible: true,
										}
									);
								}
								onClose();
							} }
						>
							Move to trash
						</MenuItem>
					</MenuGroup>
				) }
			</DropdownMenu>
		</div>
	);
};

export default FormActions;

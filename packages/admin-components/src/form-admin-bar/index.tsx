/**
 * QuillForms Dependencies
 */
import { NavLink, withRouter } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import Logo from '../logo';
import ShareFormModal from '../share-form-modal';
import FormAdminNav from './admin-nav';

const FormAdminBar = ( { formId } ) => {
	const [ isShareModalOpen, setIsShareModalOpen ] = useState( false );
	return (
		<div className="admin-components-form-admin-bar">
			<div className="admin-components-form-admin-bar__logo">
				<Logo />
			</div>
			{ /** @ts-expect-error */ }
			<FormAdminNav.Slot>
				{ ( fills ) => (
					<>
						<NavLink
							isActive={ ( _match, location ): boolean | void => {
								if (
									location.pathname ===
									`/forms/${ formId }/builder`
								) {
									return true;
								}
							} }
							activeClassName="selected"
							to={ `/admin.php?page=quillforms&path=/forms/${ formId }/builder` }
						>
							Design
						</NavLink>
						<a onClick={ () => setIsShareModalOpen( true ) }>
							Share
						</a>

						{ fills }
					</>
				) }
			</FormAdminNav.Slot>

			{ isShareModalOpen && (
				<ShareFormModal
					formId={ formId }
					closeModal={ () => setIsShareModalOpen( false ) }
				/>
			) }
		</div>
	);
};
export default withRouter( FormAdminBar );

/**
 * QuillForms Dependencies
 */
import { NavLink, withRouter } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useState } from 'react';
import { Icon } from '@wordpress/components';
import { arrowLeft } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import Logo from '../logo';
import FormAdminNav from './admin-nav';

const FormAdminBar = ({ formId }) => {
	return (
		<div className="admin-components-form-admin-bar__wrapper">
			<div className="admin-components-form-admin-bar">
				<div className="admin-components-form-admin-bar__logo">
					<Logo />
				</div>
				<NavLink
					className="admin-components-form-admin-bar__home-link"
					to={`/admin.php?page=quillforms`}
				>
					<Icon icon={arrowLeft} /> Back to home
				</NavLink>
				{ /** @ts-expect-error */}
				<FormAdminNav.Slot>
					{(fills) => (
						<>
							<NavLink
								isActive={(_match, location): boolean | void => {
									if (
										location.pathname ===
										`/forms/${formId}/builder`
									) {
										return true;
									}
								}}
								activeClassName="selected"
								to={`/admin.php?page=quillforms&path=/forms/${formId}/builder`}
							>
								Design
							</NavLink>
							<NavLink
								isActive={(_match, location): boolean | void => {
									if (
										location.pathname.startsWith(
											`/forms/${formId}/share`
										)
									) {
										return true;
									}
								}}
								activeClassName="selected"
								to={`/admin.php?page=quillforms&path=/forms/${formId}/share`}
							>
								Share
							</NavLink>
							<NavLink
								isActive={(_match, location): boolean | void => {
									if (
										location.pathname.startsWith(
											`/forms/${formId}/results`
										)
									) {
										return true;
									}
								}}
								activeClassName="selected"
								to={`/admin.php?page=quillforms&path=/forms/${formId}/results`}
							>
								Results
							</NavLink>

							<NavLink
								isActive={(_match, location): boolean | void => {
									if (
										location.pathname.startsWith(
											`/forms/${formId}/integrations`
										)
									) {
										return true;
									}
								}}
								activeClassName="selected"
								to={`/admin.php?page=quillforms&path=/forms/${formId}/integrations`}
							>
								Integrations
							</NavLink>
							<NavLink
								isActive={(_match, location): boolean | void => {
									if (
										location.pathname.startsWith(
											`/forms/${formId}/payments`
										)
									) {
										return true;
									}
								}}
								activeClassName="selected"
								to={`/admin.php?page=quillforms&path=/forms/${formId}/payments`}
							>
								Payments
							</NavLink>

							{fills}
						</>
					)}
				</FormAdminNav.Slot>
			</div>
		</div>
	);
};
export default withRouter(FormAdminBar);

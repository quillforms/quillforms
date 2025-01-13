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
import { __ } from '@wordpress/i18n';

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
					<Icon icon={arrowLeft} /> {__('Back to home', 'quillforms')}
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
								{__('Design', 'quillforms')}
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
								{__('Share', 'quillforms')}
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
								{__('Results', 'quillforms')}
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
								{__('Integrations', 'quillforms')}
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
								{__('Payments', 'quillforms')}
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

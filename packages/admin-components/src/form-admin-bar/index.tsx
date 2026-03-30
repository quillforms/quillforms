/**
 * QuillForms Dependencies
 */
import { NavLink, withRouter } from '@quillforms/navigation';

/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal Dependencies
 */
import Logo from '../logo';
import FormAdminNav from './admin-nav';
import HomeIcon from './home-icon';
import DesignIcon from './design-icon.js';
import LogicIcon from './logic-icon.js';
import ShareIcon from './share-icon.js';
import ResultsIcon from './results-icon.js';
import IntegrationsIcon from './integrations-icon.js';
import PaymentsIcon from './payments-icon.js';


const FormAdminBar = ({ formId }) => {
	const formName = useSelect(
		(select) => {
			const coreSelect = select('core') as any;
			const form = coreSelect?.getEntityRecord(
				'postType',
				'quill_forms',
				formId
			);
			return form?.title?.raw || form?.title?.rendered;
		},
		[formId]
	);

	return (
		<div className="admin-components-form-admin-bar__wrapper">
			<div className="admin-components-form-admin-bar">
				<div className="admin-components-form-admin-bar__logo">
					<Logo />
				</div>
				<div className="admin-components-form-admin-bar__home-section">
					<NavLink
						className="admin-components-form-admin-bar__home-link"
						to={`/admin.php?page=quillforms`}
					>
						<HomeIcon />
					</NavLink>
					<div className="admin-components-form-admin-bar__home-context">
						<span className="admin-components-form-admin-bar__home-separator">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
							>
								<path
									d="M15.0129 11.6687C15.0129 11.7892 14.9937 11.9014 14.9552 12.0052C14.9167 12.109 14.8507 12.2078 14.7572 12.3014L10.263 16.7957C10.1245 16.934 9.95037 17.0049 9.7407 17.0082C9.5312 17.0114 9.35395 16.9405 9.20895 16.7957C9.06412 16.6507 8.9917 16.475 8.9917 16.2687C8.9917 16.0624 9.06412 15.8867 9.20895 15.7417L13.2822 11.6687L9.20895 7.5957C9.07062 7.4572 8.99978 7.28312 8.99645 7.07345C8.99328 6.86395 9.06412 6.6867 9.20895 6.5417C9.35395 6.39686 9.52962 6.32445 9.73595 6.32445C9.94228 6.32445 10.118 6.39686 10.263 6.5417L14.7572 11.0359C14.8507 11.1296 14.9167 11.2284 14.9552 11.3322C14.9937 11.436 15.0129 11.5482 15.0129 11.6687Z"
									fill="#334155"
								/>
							</svg>
						</span>
						<span className="admin-components-form-admin-bar__home-form-name">
							{formName || __('Untitled Form', 'quillforms')}
						</span>
					</div>
				</div>
				{ /** @ts-expect-error */}
				<FormAdminNav.Slot>
					{(fills) => (
						<>
							<NavLink
								className="admin-components-form-admin-bar__nav-link"
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
								<DesignIcon />
								<span>{__('Build', 'quillforms')}</span>
							</NavLink>
							<NavLink
								className="admin-components-form-admin-bar__nav-link"
								isActive={(_match, location): boolean | void => {
									if (
										location.pathname.startsWith(
											`/forms/${formId}/logic`
										)
									) {
										return true;
									}
								}}
								activeClassName="selected"
								to={`/admin.php?page=quillforms&path=/forms/${formId}/logic`}
							>
								<LogicIcon />
								<span>{__('Logic', 'quillforms')}</span>
							</NavLink>
							<NavLink
								className="admin-components-form-admin-bar__nav-link"
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
								<ShareIcon />
								<span>{__('Share', 'quillforms')}</span>
							</NavLink>

							<NavLink
								className="admin-components-form-admin-bar__nav-link"
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
								<IntegrationsIcon />
								<span>{__('Integrations', 'quillforms')}</span>
							</NavLink>

							<NavLink
								className="admin-components-form-admin-bar__nav-link"
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
								<ResultsIcon />
								<span>{__('Results', 'quillforms')}</span>
							</NavLink>
							
							<NavLink
								className="admin-components-form-admin-bar__nav-link"
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
								<PaymentsIcon />
								<span>{__('Payments', 'quillforms')}</span>
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

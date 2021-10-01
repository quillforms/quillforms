/**
 * QuillForms Dependencies.
 */
import { getIntegrationModules } from '@quillforms/form-integrations';

/**
 * WordPress Dependencies
 */
import { Icon as IconComponent } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';

const Integrations = () => {
	const integrationsModules = getIntegrationModules();

	return (
		<div className="quillforms-integrations-tab">
			{ Object.entries( integrationsModules ).map(
				( [ slug, integration ] ) => {
					const icon = integration.icon;
					return (
						<div
							key={ slug }
							className="quillforms-integrations-tab-addon"
						>
							<div className="quillforms-integrations-tab-addon-header">
								{ typeof icon === 'string' ? (
									<img src={ icon } />
								) : (
									<IconComponent
										icon={ icon?.src ? icon.src : icon }
									/>
								) }
								<h4>{ integration.title }</h4>
							</div>
							<div className="quillforms-integrations-tab-addon-body">
								<integration.settingsRender slug={ slug } />
							</div>
						</div>
					);
				}
			) }
		</div>
	);
};

export default Integrations;

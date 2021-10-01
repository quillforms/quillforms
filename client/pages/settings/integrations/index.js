/**
 * QuillForms Dependencies.
 */
import { getIntegrationModules } from '@quillforms/form-integrations';

/**
 * WordPress Dependencies
 */
import { Panel, PanelBody } from '@wordpress/components';
import { Icon as IconComponent } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';

const Integrations = () => {
	const integrationsModules = getIntegrationModules();

	return (
		<div className="quillforms-integrations-tab">
			<Panel>
				{ Object.entries( integrationsModules ).map(
					( [ slug, integration ] ) => {
						const icon = integration.icon;
						const header = (
							<div className="quillforms-integrations-tab-addon-header">
								{ typeof icon === 'string' ? (
									<img src={ icon } />
								) : (
									<IconComponent
										icon={ icon?.src ? icon.src : icon }
									/>
								) }
								<div>{ integration.title }</div>
							</div>
						);
						return (
							<PanelBody
								key={ slug }
								title={ header }
								initialOpen={ false }
								className="quillforms-integrations-tab-addon"
							>
								<div className="quillforms-integrations-tab-addon-body">
									<integration.settingsRender slug={ slug } />
								</div>
							</PanelBody>
						);
					}
				) }
			</Panel>
		</div>
	);
};

export default Integrations;

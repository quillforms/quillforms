import { getIntegrationModule } from '@quillforms/form-integrations';

const Integration = ( { slug, isLoading } ) => {
	const integrationModule = getIntegrationModule( slug );

	return (
		<div className="quillforms-single-integration">
			{ ! isLoading ? (
				<integrationModule.render />
			) : (
				'Loading integration page...'
			) }
		</div>
	);
};

export default Integration;

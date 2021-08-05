import { useParams } from '@quillforms/navigation';
import { getIntegrationModule } from '@quillforms/form-integrations';
import { css } from 'emotion';

const SingleIntegrationPage = () => {
	const { slug } = useParams();
	const integrationModule = getIntegrationModule( slug );

	return (
		<div className="quillforms-single-integration">
			{ integrationModule ? (
				<integrationModule.render />
			) : (
				<div
					className={ css`
						background: #e05252;
						color: #fff;
						padding: 10px;
						border-radius: 5px;
						max-width: 300px;
						margin: auto;
						text-align: center;
						margin-top: 100px;
					` }
				>
					Page Not found!
				</div>
			) }
		</div>
	);
};

export default SingleIntegrationPage;

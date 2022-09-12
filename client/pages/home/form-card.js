/**
 * WordPress Dependencies
 */
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { memo, useState } from '@wordpress/element';

/**
 * External Dependencies
 */
import { getNewPath, getHistory } from '@quillforms/navigation';
import { css } from 'emotion';
import classnames from 'classnames';
import FormActions from './form-actions';

const FormCard = memo( ( { form } ) => {
	const [ isLoading, setIsLoading ] = useState( false );

	const theme = form?.theme?.theme_data?.properties
		? form.theme.theme_data.properties
		: {};

	let backgroundImageCSS = '';
	if ( theme?.backgroundImage ) {
		backgroundImageCSS = `background: url('${ theme.backgroundImage }') no-repeat;
				background-size: cover;
				background-position: center;
			`;
	}
	return (
		<>
			{ ! isLoading ? (
				<Card
					className="quillforms-home__form-card"
					onClick={ () => {
						const history = getHistory();
						history.push(
							getNewPath( {}, `/forms/${ form.id }/builder` )
						);
					} }
				>
					<div
						className={ classnames(
							'quillforms-home__form-card-body-header',
							css`
								${ backgroundImageCSS }
							`
						) }
					>
						<CardBody
							className={ classnames(
								'quillforms-home__form-card-body',
								css`
									background: ${ theme.backgroundColor };
								`
							) }
						>
							<div
								className={ classnames(
									'quillforms-home__form-title',
									css`
										color: ${ theme.questionsColor };
										text-decoration: none;
									`
								) }
							>
								{ form.title.rendered
									? form.title.rendered
									: 'Untitled' }
							</div>
						</CardBody>
					</div>
					<CardDivider />
					<CardHeader
						className={ classnames(
							'quillforms-home__form-card-footer',
							css`
								color: ${ form.status === 'publish'
									? '#18c485'
									: '#8f8e8e' };
								flex: 1 1;
								border-radius: 0;
							`
						) }
					>
						<div className="quillforms-home__form-card-footer-post-status">
							{ form.status === 'publish'
								? 'Published'
								: 'Draft' }
						</div>

						<FormActions
							form={ form }
							formId={ form.id }
							setIsLoading={ setIsLoading }
						/>
					</CardHeader>
				</Card>
			) : (
				<Card className="quillforms-home__card-loader">
					<CardBody className="quillforms-home__card-loader-body"></CardBody>
					<CardDivider />
					<CardHeader className="quillforms-home__card-loader-footer">
						<div className="quillforms-home__card-loader-footer-text"></div>
					</CardHeader>
				</Card>
			) }{ ' ' }
		</>
	);
} );

export default FormCard;

/**
 * WordPress Dependencies
 */
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { memo } from '@wordpress/element';

/**
 * External Dependencies
 */
import { getNewPath, getHistory } from '@quillforms/navigation';
import { css } from 'emotion';
import classnames from 'classnames';
import FormActions from './form-actions';

const FormCard = memo( ( { form } ) => {
	const theme = form?.theme?.theme_data?.properties
		? form.theme.theme_data.properties
		: {};
	return (
		<Card
			className="quillforms-home__form-card"
			onClick={ () => {
				const history = getHistory();
				history.push( getNewPath( {}, `/forms/${ form.id }/builder` ) );
			} }
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
					{ form.title.rendered ? form.title.rendered : 'Untitled' }
				</div>
			</CardBody>
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
					{ form.status === 'publish' ? 'Published' : 'Draft' }
				</div>

				<FormActions formId={ form.id } />
			</CardHeader>
		</Card>
	);
} );

export default FormCard;

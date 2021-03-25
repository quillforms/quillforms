/**
 * WordPress Dependencies
 */
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';

/**
 * External Dependencies
 */
import { getNewPath, NavLink } from '@quillforms/navigation';
import { css } from 'emotion';
import classnames from 'classnames';

const FormCard = ( { form } ) => {
	const theme = form?.theme?.theme_data?.properties
		? form.theme.theme_data.properties
		: {};
	return (
		<Card className="quillforms-home__form-card">
			<NavLink
				to={ getNewPath( {}, `/forms/${ form.id }/builder` ) }
				className={ css`
					text-decoration: none;
					display: flex;
					flex-direction: column;
					justify-content: center;
					height: 100%;
				` }
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
						{ form.status === 'publish' ? 'Publish' : 'Draft' }
					</div>
				</CardHeader>
			</NavLink>
		</Card>
	);
};

export default FormCard;

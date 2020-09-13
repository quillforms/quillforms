/* eslint-disable no-nested-ternary */

/**
 * WordPress Dependencies
 */
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { Icon, plusCircle } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
/**
 * External Dependencies
 */
import { getNewPath } from '@woocommerce/navigation';
import { Link } from 'react-router-dom';
import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import './style.scss';
import AddFormModal from './add-form-modal';

const Home = () => {
	const [ isFetching, setIsFetching ] = useState( true );
	const [ publishedForms, setPublishedForms ] = useState( null );
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	const apiPath = addQueryArgs( '/wp/v2/quill_forms', {
		status: 'publish,draft',
		per_page: 60,
	} );
	useEffect( () => {
		// GET
		apiFetch( {
			path: apiPath,
			method: 'GET',
		} )
			.then( ( res ) => {
				console.log( res );
				setPublishedForms( res );
				setIsFetching( false );
			} )
			.catch( ( err ) => {
				console.log( err );
			} );
	}, [] );

	return (
		<div className="quillforms-home">
			<h1 className="quillforms-home__heading">All Forms</h1>
			<div className="quillforms-home__all-forms">
				<Card
					className="quillforms-home__add-form-card"
					onClick={ openModal }
				>
					<CardBody className="quillforms-home__add-form-card-body">
						<Icon
							className="quillforms-home__add-form-card-icon"
							icon={ plusCircle }
							size={ 30 }
						/>
						Add New
					</CardBody>
				</Card>
				{ isOpen && <AddFormModal closeModal={ closeModal } /> }
				{ isFetching ? (
					new Array( 4 ).fill().map( ( _, index ) => {
						return (
							<Card
								key={ `card-loader-${ index } ` }
								className="quillforms-home__card-loader"
							>
								<CardBody className="quillforms-home__card-loader-body"></CardBody>
								<CardDivider />
								<CardHeader className="quillforms-home__card-loader-footer">
									<div className="quillforms-home__card-loader-footer-text"></div>
								</CardHeader>
							</Card>
						);
					} )
				) : publishedForms.length === 0 ? (
					<Card className="quillforms-home__empty-form-card"></Card>
				) : (
					publishedForms.map( ( form ) => {
						const theme = form.theme.theme_data;
						return (
							<Card
								key={ form.id }
								className="quillforms-home__form-card"
							>
								<Link
									to={ getNewPath(
										{},
										`/forms/${ form.id }/builder`
									) }
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
												background-color: ${theme.backgroundColor};
											`
										) }
									>
										<div
											className={ classnames(
												'quillforms-home__form-title',
												css`
													color: ${theme.questionsColor};
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
												background: ${form.status ===
												'publish'
													? '#18c485'
													: '#8f8e8e'};
												flex: 1 1;
												border-radius: 0;
											`
										) }
									>
										<div className="quillforms-home__form-card-footer-post-status">
											{ form.status === 'publish'
												? 'Publish'
												: 'Draft' }
										</div>
									</CardHeader>
								</Link>
							</Card>
						);
					} )
				) }
			</div>
		</div>
	);
};

export default Home;

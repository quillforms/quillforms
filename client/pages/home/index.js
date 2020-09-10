/* eslint-disable no-nested-ternary */

/**
 * WordPress Dependencies
 */
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { Icon, plusCircle } from '@wordpress/icons';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { getNewPath } from '@woocommerce/navigation';
import { Link } from 'react-router-dom';

/**
 * Internal Dependencies
 */
import './style.scss';
import AddFormModal from './add-form-modal';

const Home = ( { history } ) => {
	const [ isFetching, setIsFetching ] = useState( true );
	const [ publishedForms, setPublishedForms ] = useState( null );
	const [ isOpen, setOpen ] = useState( false );
	const openModal = () => setOpen( true );
	const closeModal = () => setOpen( false );

	useEffect( () => {
		// GET
		apiFetch( {
			path: '/wp/v2/quill_forms?status=draft',
			method: 'GET',
		} )
			.then( ( res ) => {
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
					<Card className="quillforms-home__card-loader">
						<CardBody className="quillforms-home__card-loader-body"></CardBody>
						<CardDivider />
						<CardHeader className="quillforms-home__card-loader-footer">
							<div className="quillforms-home__card-loader-footer-text"></div>
						</CardHeader>
					</Card>
				) : publishedForms.length === 0 ? (
					<Card className="quillforms-home__empty-form-card"></Card>
				) : (
					publishedForms.map( ( form ) => {
						return (
							<Link
								key={ form.id }
								to={ getNewPath(
									{},
									`/forms/${ form.id }/builder`
								) }
							>
								<Card className="quillforms-home__form-card">
									<CardBody className="quillforms-home__form-card-body">
										<div className="quillforms-home__form-title">
											{ form.title.rendered }
										</div>
									</CardBody>
									<CardDivider />
									<CardHeader className="quillforms-home__form-card-footer"></CardHeader>
								</Card>
							</Link>
						);
					} )
				) }
			</div>
		</div>
	);
};

export default Home;

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
 * Internal Dependencies
 */
import './style.scss';
import AddFormModal from './add-form-modal';
import FormCard from './form-card';

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
						return <FormCard key={ form.id } form={ form } />;
					} )
				) }
			</div>
		</div>
	);
};

export default Home;

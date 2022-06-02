/* eslint-disable no-nested-ternary */

/**
 * WordPress Dependencies
 */
import { Card, CardBody, CardDivider, CardHeader } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { Icon, plusCircle } from '@wordpress/icons';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import './style.scss';
import AddFormModal from './add-form-modal';
import FormCard from './form-card';

const HomeContent = () => {
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ isFetchingOnMount, setIsFetchingOnMount ] = useState( true );

	const { invalidateResolution } = useDispatch( 'core/data' );
	const recordArgs = [
		'postType',
		'quill_forms',
		{
			status: 'publish,draft',
			per_page: -1,
		},
	];
	const { forms, hasFormsFinishedResolution } = useSelect( ( select ) => {
		return {
			forms: select( 'core' ).getEntityRecords( ...recordArgs ),
			hasFormsFinishedResolution: select( 'core' ).hasFinishedResolution(
				'getEntityRecords',
				recordArgs
			),
		};
	}, [] );

	// Invalidate resolution for entity record on unmount
	useEffect( () => {
		return () => {
			invalidateResolution( 'core', 'getEntityRecords', recordArgs );
		};
	}, [] );
	useEffect( () => {
		if ( hasFormsFinishedResolution ) {
			setIsFetchingOnMount( false );
		} else {
			setIsFetchingOnMount( true );
		}
	}, [ hasFormsFinishedResolution ] );

	const openModal = () => setIsModalOpen( true );
	const closeModal = () => setIsModalOpen( false );

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
				{ isModalOpen && <AddFormModal closeModal={ closeModal } /> }
				{ ! hasFormsFinishedResolution && isFetchingOnMount ? (
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
				) : forms.length === 0 ? (
					<Card className="quillforms-home__empty-form-card"></Card>
				) : (
					forms.map( ( form ) => {
						return <FormCard key={ form.id } form={ form } />;
					} )
				) }
			</div>
		</div>
	);
};

export default HomeContent;

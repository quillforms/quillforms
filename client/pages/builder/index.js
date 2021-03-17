/**
 * QuillForms Dependencies
 */
import { BuilderLayout } from '@quillforms/builder-core';
import { getRestFields } from '@quillforms/rest-fields';
import configApi from '@quillforms/config';
/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { flatten, map, forEach } from 'lodash';
import Loader from 'react-loader-spinner';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';

const Builder = ( { params } ) => {
	const { id } = params;

	const { invalidateResolutionForStore } = useDispatch( 'core/data' );
	const connectedStores = flatten(
		map( getRestFields(), ( restField ) => restField.connectedStores )
	);
	const [ isFetching, setIsFetching ] = useState( true );

	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/quill_forms/${ id }`,
			method: 'GET',
		} ).then( ( res ) => {
			configApi.setInitialBuilderPayload( res );
			setIsFetching( false );
		} );
		forEach( connectedStores, ( store ) => {
			console.log( wp.data.RegistryConsumer._currentValue.stores );
			if (
				store &&
				wp.data.RegistryConsumer._currentValue.stores[ store ]
			)
				invalidateResolutionForStore( store );
		} );
	}, [] );
	return (
		<div id="quillforms-layout-wrapper">
			{ isFetching ? (
				<div
					className={ css`
						display: flex;
						flex-wrap: wrap;
						width: 100%;
						min-height: 100vh;
						justify-content: center;
						align-items: center;
					` }
				>
					<Loader
						type="Bars"
						color="#00BFFF"
						height={ 30 }
						width={ 30 }
					/>
				</div>
			) : (
				<BuilderLayout />
			) }
		</div>
	);
};

export default Builder;

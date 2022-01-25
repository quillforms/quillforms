/**
 * WordPress Dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * React
 */
import { useEffect, useState } from 'react';

/**
 * External Dependencies
 */
import Loader from 'react-loader-spinner';
import { css } from 'emotion';

const Share = ( { params } ) => {
	const { id } = params;
	const [ isLoading, setIsLoading ] = useState( true );
	const [ payload, setPayload ] = useState( null );

	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/quill_forms/${ id }`,
			method: 'GET',
		} ).then( ( res ) => {
			setIsLoading( false );
			setPayload( res );
		} );
	}, [] );
	return (
		<div className="">
			{ isLoading ? (
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
				<did></did>
			) }
		</div>
	);
};

export default Share;

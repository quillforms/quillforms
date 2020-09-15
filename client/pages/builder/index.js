/**
 * QuillForms Dependencies
 */
import { EditorProvider } from '@quillforms/builder-core';

/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import Loader from 'react-loader-spinner';
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';

const Builder = ( { params } ) => {
	const { id } = params;
	const [ isFetching, setIsFetching ] = useState( true );

	useEffect( () => {
		apiFetch( {
			path: `/wp/v2/quill_forms/${ id }`,
			method: 'GET',
		} ).then( ( res ) => {
			window.qfInitialPayload = res;
			setIsFetching( false );
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
				<EditorProvider />
			) }
		</div>
	);
};

export default Builder;

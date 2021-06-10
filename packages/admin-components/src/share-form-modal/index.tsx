/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { Modal } from '@wordpress/components';
import { useState } from '@wordpress/element';

/**
 * External Dependencies
 */

import { css } from 'emotion';
import classnames from 'classnames';

/**
 * Internal Dependencies
 */
import LinkPlaceholder from './link-placeholder';

interface Props {
	formId: number;
	closeModal: () => void;
}
const ShareFormModal: React.FC< Props > = ( { formId, closeModal } ) => {
	const [ isFetching, setIsFetching ] = useState( true );
	const [ permalink, setPermalink ] = useState( '' );

	// Invalidate resolution for entity record on unmount
	useEffect( () => {
		apiFetch( {
			path: addQueryArgs( `/wp/v2/quill_forms/${ formId }`, {
				_fields: [ 'link' ],
			} ),
		} ).then( ( res ) => {
			setIsFetching( false );
			//@ts-expect-error
			setPermalink( res.link );
		} );
	}, [] );

	return (
		<Modal
			className={ classnames(
				css`
					border: none !important;
					min-width: 420px !important;
					max-width: 470px !important;
					border-radius: 10px;
					z-index: 1111111;
				`
			) }
			title="Share form"
			onRequestClose={ closeModal }
		>
			<div
				className={ classnames(
					'admin-components-share-form-modal__link',
					css`
						display: flex;
						flex-direction: column;
						margin-top: 10px;
					`
				) }
			>
				<div
					className={ css`
						margin-bottom: 6px;
						font-weight: bold;
					` }
				>
					Link
				</div>
				{ isFetching ? (
					<LinkPlaceholder />
				) : (
					<div
						className={ css`
							border-radius: 5px;
							padding: 8px;
							background: #eeeeee;
						` }
					>
						<a href={ permalink } target="_blank">
							{ permalink }
						</a>
					</div>
				) }
			</div>
			<div
				className={ classnames(
					'admin-components-share-form-modal__embed',
					css`
						display: flex;
						flex-direction: column;
						margin-top: 10px;
					`
				) }
			>
				<div
					className={ css`
						margin-bottom: 6px;
						font-weight: bold;
					` }
				>
					Embed
				</div>
				{ isFetching ? (
					<LinkPlaceholder />
				) : (
					<div
						className={ css`
							border-radius: 5px;
							padding: 8px;
							background: #eeeeee;
						` }
					>
						{ `<iframe src="${ permalink }" width="500" height="600"/>` }
					</div>
				) }
			</div>
		</Modal>
	);
};

export default ShareFormModal;

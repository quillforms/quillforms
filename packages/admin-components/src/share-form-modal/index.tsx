/**
 * WordPress Dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs, buildQueryString } from '@wordpress/url';
import { Modal } from '@wordpress/components';

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
	const { hiddenFields } = useSelect( ( select ) => {
		return {
			hiddenFields:
				select(
					'quillForms/hidden-fields-editor'
				)?.getHiddenFields() ?? [],
		};
	} );

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

	let link = permalink;
	if ( hiddenFields.length > 0 ) {
		const hash = {};
		for ( const field of hiddenFields ) {
			hash[ field.name ] = 'xxxxx';
		}
		link += '#' + buildQueryString( hash );
	}

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
						<a href={ link } target="_blank">
							{ link }
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
						{ `<iframe src="${ link }" width="500" height="600"></iframe>` }
					</div>
				) }
			</div>
		</Modal>
	);
};

export default ShareFormModal;

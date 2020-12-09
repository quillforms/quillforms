/**
 * External dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { NoticeList, SnackbarList } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

export function BuilderNotices() {
	const { notices } = useSelect( ( select ) => {
		return {
			notices: select( 'core/notices' ).getNotices(),
		};
	} );

	const { removeNotice } = useDispatch( 'core/notices' );

	const snackbarNotices = filter( notices, {
		type: 'snackbar',
	} );

	return (
		<>
			<SnackbarList
				notices={ snackbarNotices }
				className="builder-core-builder-notices__snackbar"
				onRemove={ removeNotice }
			/>
		</>
	);
}

export default BuilderNotices;

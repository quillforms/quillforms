/**
 * External dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { SnackbarList, NoticeList } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

const AdminNotices = () => {
	const { notices } = useSelect( ( select ) => {
		return {
			notices: select( 'core/notices' ).getNotices(),
		};
	} );

	const { removeNotice } = useDispatch( 'core/notices' );

	const snackbarNotices = filter( notices, {
		type: 'snackbar',
	} ) as Readonly< NoticeList.Notice[] >;

	useEffect( () => {
		if ( snackbarNotices.length > 2 ) {
			snackbarNotices
				.slice( 0, snackbarNotices.length - 2 )
				.forEach( ( notice ) => removeNotice( notice.id ) );
		}
	}, [ snackbarNotices ] );

	return (
		<>
			<SnackbarList
				notices={ snackbarNotices }
				className="admin-components-admin-notices__snackbar"
				onRemove={ removeNotice }
			/>
		</>
	);
};

export default AdminNotices;

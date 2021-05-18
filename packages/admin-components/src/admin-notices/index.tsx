/**
 * External dependencies
 */
import { filter } from 'lodash';

/**
 * WordPress dependencies
 */
import { SnackbarList, NoticeList } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

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

	return (
		<>
			<SnackbarList
				notices={ snackbarNotices }
				className="builder-core-builder-notices__snackbar"
				onRemove={ removeNotice }
			/>
		</>
	);
};

export default AdminNotices;

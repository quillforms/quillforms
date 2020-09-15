/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import './style.scss';
import FullScreenNavBar from './fullscreen-navbar';

const AdminFullScreen = ( props ) => {
	const { children } = props;
	const { id } = props.match.params;
	useEffect( () => {
		document
			.getElementsByTagName( 'body' )[ 0 ]
			.classList.add( 'js', 'is-fullscreen-mode' );
	}, [] );
	return (
		<div className="quillforms-admin-full-screen">
			<FullScreenNavBar formId={ id } />
			{ children }
		</div>
	);
};

export default AdminFullScreen;

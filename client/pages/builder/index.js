import './style.scss';
import { useEffect } from '@wordpress/element';
import { EditorProvider } from '@quillforms/builder-core';

const Builder = ( { params } ) => {
	useEffect( () => {
		document
			.getElementsByTagName( 'body' )[ 0 ]
			.classList.add( 'js', 'is-fullscreen-mode' );
		return () => {
			document
				.getElementsByTagName( 'body' )[ 0 ]
				.classList.remove( 'js', 'is-fullscreen-mode' );
		};
	}, [] );
	return (
		<div id="quillforms-layout-wrapper">
			<EditorProvider />
		</div>
	);
};

export default Builder;

import { createPortal } from '@wordpress/element';

const Portal = ( { children } ) => {
	return createPortal( children, document.body );
};

export default Portal;

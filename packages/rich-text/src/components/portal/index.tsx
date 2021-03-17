import { createPortal } from '@wordpress/element';

const Portal: React.FC = ( { children } ) => {
	return createPortal( children, document.body );
};

export default Portal;

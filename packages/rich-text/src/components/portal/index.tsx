import { createPortal } from 'react-dom';

const Portal: React.FC = ( { children } ) => {
	return createPortal( children, document.body );
};

export default Portal;

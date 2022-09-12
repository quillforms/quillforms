import { FC } from 'react';

interface Props {
	children?: React.ReactNode; // 👈️ added type for children
}

const BaseControl: FC< Props > = ( { children } ) => {
	return <div className="admin-components-base-control">{ children }</div>;
};
export default BaseControl;

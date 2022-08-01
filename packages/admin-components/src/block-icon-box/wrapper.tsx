import { FC } from 'react';

interface Props {
	color?: string;
	children?: React.ReactNode; // 👈️ added type for children
}

const BlockIconWrapper: FC< Props > = ( { color, children } ) => {
	return (
		<div
			className="admin-components-block-icon-box"
			style={ {
				background: color ? color : '#333',
			} }
		>
			{ children }
		</div>
	);
};

export default BlockIconWrapper;

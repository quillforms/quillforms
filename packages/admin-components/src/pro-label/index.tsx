/**
 * External Dependencies
 */
import { css } from 'emotion';

const ProLabel: React.FC = () => {
	return (
		<div
			className={ css`
				display: inline-block;
				font-style: normal;
				font-size: 10px;
				background: #6d78d8;
				color: #fff;
				padding: 0 5px;
				border-radius: 3px;
				margin-left: 6px;
			` }
		>
			PRO
		</div>
	);
};

export default ProLabel;

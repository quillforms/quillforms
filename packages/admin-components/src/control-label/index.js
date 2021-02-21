/**
 * External Dependencies.
 */
import { css } from 'emotion';

const ControlLabel = ( { label, showAsterisk } ) => {
	return (
		<div className="admin-components-control-label">
			{ label }
			{ showAsterisk && (
				<span
					className={ css`
						color: #d94343;
						font-size: 16px;
						margin-left: 1px;
					` }
				>
					*
				</span>
			) }
		</div>
	);
};

export default ControlLabel;

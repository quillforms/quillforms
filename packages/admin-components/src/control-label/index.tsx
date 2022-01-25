/**
 * External Dependencies.
 */
import { css } from 'emotion';
interface Props {
	label: string;
	showAsterisk?: boolean;
}
const ControlLabel: React.FC< Props > = ( { label, showAsterisk } ) => {
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

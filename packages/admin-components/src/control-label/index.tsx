/**
 * External Dependencies.
 */
import { css } from 'emotion';
interface Props {
	label: string;
	showAsterisk?: boolean;
	isNew?: boolean;
}
const ControlLabel: React.FC< Props > = ( { label, showAsterisk, isNew } ) => {
	return (
		<div className="admin-components-control-label">
			{ label }
			{ showAsterisk && (
				<span
					className={ css`
						color: #d94343;
						font-size: 13px;
						margin-left: 1px;
					` }
				>
					*
				</span>
			) }
			{ isNew && (
				<div className="admin-components-control-label__new-feature">
					New
				</div>
			) }
		</div>
	);
};

export default ControlLabel;

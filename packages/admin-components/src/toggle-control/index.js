/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';

const ToggleControl = ( { className, checked, onChange = noop, ...props } ) => {
	const wrapperClasses = classnames(
		'admin-components-toggle-control',
		className,
		{
			'is-checked': checked,
		}
	);

	return (
		<span className={ wrapperClasses }>
			<span className="admin-components-toggle-control__base">
				<span className="admin-components-toggle-control__input-wrapper">
					<input
						className="admin-components-toggle-control__input"
						type="checkbox"
						checked={ checked }
						onChange={ onChange }
						{ ...props }
					/>
					<span className="admin-components-toggle-control__thumb"></span>
				</span>
			</span>
			<span className="admin-components-toggle-control__track"></span>
		</span>
	);
};

export default ToggleControl;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { noop } from 'lodash';
import { FC } from 'react';

interface Props {
	className?: string | undefined;
	checked?: boolean;
	onChange?: () => void;
	[x: string]: unknown;
}

const ToggleControl: FC<Props> = ({
	className,
	checked = false,
	onChange = noop,
	...props
}) => {
	const wrapperClasses = classnames(
		'admin-components-toggle-control',
		className,
		{
			'is-checked': checked,
		}
	);

	return (
		<label className={wrapperClasses}>
			<input
				className="admin-components-toggle-control__input"
				type="checkbox"
				checked={checked}
				onChange={onChange}
				{...props}
			/>
			<span className="admin-components-toggle-control__thumb"></span>
			<span className="admin-components-toggle-control__track"></span>
		</label>
	);
};

export default ToggleControl;
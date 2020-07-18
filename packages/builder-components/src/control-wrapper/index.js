import classnames from 'classnames';
const ControlWrapper = ( { children, orientation = 'horizontal' } ) => {
	return (
		<div
			className={ classnames(
				'builder-components-control-wrapper',
				orientation
			) }
		>
			{ children }
		</div>
	);
};

export default ControlWrapper;

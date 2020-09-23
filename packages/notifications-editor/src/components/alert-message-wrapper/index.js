import classnames from 'classnames';
const AlertMessageWrapper = ( { children, type } ) => {
	return (
		<div
			className={ classnames(
				'notifications-editor-alert-message-wrapper',
				`has-${ type }`
			) }
		>
			{ children }
		</div>
	);
};
export default AlertMessageWrapper;

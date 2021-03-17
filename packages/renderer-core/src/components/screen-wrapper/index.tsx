const ScreenWrapper = ( { children, type, id, hasStickyFooter } ) => {
	return (
		<div
			id={ 'block-' + id }
			className={
				'renderer-component-screen-wrapper ' +
				type +
				'__block' +
				( hasStickyFooter ? ' with-sticky-footer' : '' )
			}
		>
			{ children }
		</div>
	);
};
export default ScreenWrapper;

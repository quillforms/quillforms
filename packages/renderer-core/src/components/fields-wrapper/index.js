const FieldsWrapper = ( { children, isActive, scrollHandler } ) => {
	return (
		<div
			onWheel={ scrollHandler }
			className={
				'renderer-core-fileds-wrapper' + ( isActive ? ' active' : '' )
			}
		>
			{ children }
		</div>
	);
};
export default FieldsWrapper;

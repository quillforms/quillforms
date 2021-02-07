const DropdownMergeTag = ( { val, attributes } ) => {
	const { choices } = attributes;
	const choice = choices.find( ( a ) => a.value === val );
	return <>{ choice?.label ? choice.label : '_ _ _ _ _' }</>;
};

export default DropdownMergeTag;

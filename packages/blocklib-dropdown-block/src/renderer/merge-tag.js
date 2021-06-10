const DropdownMergeTag = ( { val, attributes } ) => {
	const { choices } = attributes;
	const choiceIndex = choices.findIndex( ( a ) => a.value === val );
	let label = '_ _ _ _';
	if ( choices[ choiceIndex ] ) {
		label = choices[ choiceIndex ].label;

		if ( ! label ) {
			label = 'Choice ' + ( index + 1 );
		}
	}
	return <>{ label }</>;
};

export default DropdownMergeTag;

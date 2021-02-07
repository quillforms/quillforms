import { join } from 'lodash';
const DropdownMergeTag = ( { val, attributes } ) => {
	const { choices } = attributes;
	const mergedChoices = val.map( ( item ) => {
		const choice = choices.find( ( a ) => a.value === item );
		return choice.label;
	} );
	return <>{ join( mergedChoices, ',' ) }</>;
};

export default DropdownMergeTag;

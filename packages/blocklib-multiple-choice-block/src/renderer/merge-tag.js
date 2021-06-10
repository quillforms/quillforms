import { join } from 'lodash';
const DropdownMergeTag = ( { val, attributes } ) => {
	const { choices } = attributes;
	const mergedChoices = val.map( ( item ) => {
		const choiceIndex = choices.findIndex( ( a ) => a.value === item );
		let choiceLabel = 'Choice ' + ( choiceIndex + 1 );
		if ( choices[ choiceIndex ].label ) {
			choiceLabel = choices[ choiceIndex ].label;
		}
		return choiceLabel;
	} );
	return <>{ join( mergedChoices, ',' ) }</>;
};

export default DropdownMergeTag;

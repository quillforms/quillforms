import { join } from 'lodash';
const DropdownMergeTag = ({ val, attributes }) => {
	const { choices } = attributes;
	const mergedChoices = val.map((item) => {
		if (typeof item === 'object' && item.type === 'other') {
			// Show 'Other: ...' or just the value
			return item.value ? `Other: ${item.value}` : 'Other';
		}
		const choiceIndex = choices.findIndex((a) => a.value === item);
		if (choiceIndex !== -1) {
			return choices[choiceIndex].label || `Choice ${choiceIndex + 1}`;
		}
		return item; // fallback
	});
	return <>{join(mergedChoices, ', ')}</>;
};

export default DropdownMergeTag;

import { join } from 'lodash';
const DropdownMergeTag = ({ val, attributes }) => {
	const { yesLabel, noLabel } = attributes;
	return (
		<>{val === 'yes' ? yesLabel : noLabel}</>
	)
};

export default DropdownMergeTag;

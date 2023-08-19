/**
 * QuillForms Dependencies
 */
import { SelectControl } from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useEffect } from 'react';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const DropdownLogicControl = ({
	attributes,
	value,
	setValue,
	removeCondition,
}) => {
	const { yesLabel, noLabel } = attributes;

	useEffect(() => {
		if (!value) {
			setValue('yes');
		}
	}, []);
	const options = {
		'yes': yesLabel,
		'no': noLabel,
	}
	return (
		<SelectControl
			className={css`
				margin-top: 10px;
				margin-bottom: 10px;
			` }
			value={options.find((option) => option.key === value)}
			onChange={(selectedChoice) => {
				setValue(selectedChoice.selectedItem.key);
			}}
			options={options}
		/>
	);
};

export default DropdownLogicControl;

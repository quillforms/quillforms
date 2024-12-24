const getChoices = ({ attributes }) => {
	return [{ label: attributes.yesLabel, value: 'yes' }, {
		label: attributes.noLabel, value: 'no'
	}]
};

export default getChoices;

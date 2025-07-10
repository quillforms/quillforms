const getChoices = ({ attributes }) => {
	const choices = attributes?.choices ?? [];
	const other = attributes?.other ?? false;
	if (other) {
		choices.push({
			type: 'other',
			label: 'Other',
		});
	}
	return choices;
};

export default getChoices;

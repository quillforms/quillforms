const getChoices = ( { attributes } ) => {
	return attributes?.choices ?? [];
};

export default getChoices;

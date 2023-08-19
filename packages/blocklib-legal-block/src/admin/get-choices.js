const getChoices = ({ attributes }) => {
	return {
		yes: attributes.yesLabel,
		no: attributes.noLabel,
	};
};

export default getChoices;

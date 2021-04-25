const generateChoiceId = (): string => {
	return Math.random().toString( 36 ).substr( 2, 10 );
};
export default generateChoiceId;

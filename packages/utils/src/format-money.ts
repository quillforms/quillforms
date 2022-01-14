const formatMoney = ( value: number, currency: string, format: string ) => {
	switch ( format ) {
		case 'left':
			format = '%c%v';
			break;
		case 'left_space':
			format = '%c %v';
			break;
		case 'right':
			format = '%v%c';
			break;
		case 'right_space':
			format = '%v %c';
			break;
	}
	return format.replace( '%c', currency ).replace( '%v', value.toString() );
};

export default formatMoney;

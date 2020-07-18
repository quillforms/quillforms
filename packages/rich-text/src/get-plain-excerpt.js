const getPlainExcerpt = ( value ) => {
	let $value = value
		.replace( /(<([^>]+)>)/gi, '' )
		.replace( /{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/g, '______' );
	if ( $value.length > 30 ) {
		$value = $value.substr( 0, 30 );
		$value = $value.substr( 0, $value.lastIndexOf( ' ' ) + 1 ) + '...';
	}
	return $value;
};
export default getPlainExcerpt;

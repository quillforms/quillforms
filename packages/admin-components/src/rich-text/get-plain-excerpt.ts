const getPlainExcerpt = ( value?: string ): string => {
	if ( ! value ) return '';
	let $value = value
		.replace( /(<([^>]+)>)/gi, '' )
		.replace( /{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g, '______' )
		.replace( /\n/g, ' ' );
	if ( $value.length > 30 ) {
		$value = $value.substr( 0, 30 );
		$value = $value.substr( 0, $value.lastIndexOf( ' ' ) + 1 ) + '...';
	}
	return $value;
};
export default getPlainExcerpt;

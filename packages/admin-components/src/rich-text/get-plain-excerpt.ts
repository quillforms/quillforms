const getPlainExcerpt = (value?: string, number: number = 30): string => {
	if (!value) return '';
	let $value = value
		// Replace <br>, <br/>, <br /> tags with space
		.replace(/<br\s*\/?>/gi, ' ')
		// Remove all other HTML tags
		.replace(/(<([^>]+)>)/gi, '')
		// Replace merge tags with placeholder
		.replace(/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g, '______')
		// Replace newlines with space
		.replace(/\n/g, ' ')
		// Replace multiple consecutive spaces with single space
		.replace(/\s+/g, ' ');

	if ($value.length > number) {
		$value = $value.substr(0, number);
		$value = $value.substr(0, $value.lastIndexOf(' ') + 1) + '...';
	}
	return $value;
};

export default getPlainExcerpt;
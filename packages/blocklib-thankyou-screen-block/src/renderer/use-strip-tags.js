const useStripTags = ( val ) => {
	return val.replace( /<\/?[^>]+(>|$)/g, '' ).replace(/&amp;/g, '&');
};

export default useStripTags;

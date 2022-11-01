const useStripTags = ( val: string ) => {
	return val.replace( /<\/?[^>]+(>|$)/g, '' );
};

export default useStripTags;

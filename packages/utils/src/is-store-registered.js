const isStoreRegisered = ( storeKey ) => {
	const allStores = wp?.data?.RegistryConsumer?._currentValue.stores
		? {}
		: wp.data.RegistryConsumer._currentValue.stores;
	if ( allStores[ storeKey ] ) {
		return true;
	}
	return false;
};
export default isStoreRegisered;

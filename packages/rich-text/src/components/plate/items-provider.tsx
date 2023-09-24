import { createContext, useMemo, useContext } from '@wordpress/element';

// create a React context provider
const ItemsContext = createContext({
    items: []
});

const ItemsContextProvider = ({ children, value }) => {
    const memoizedValue = useMemo(() => value, Object.values(value));

    return (
        <ItemsContext.Provider value={memoizedValue}>
            {children}
        </ItemsContext.Provider>
    );
};

const useItemsContext = () => useContext(ItemsContext);



export { ItemsContextProvider, useItemsContext };

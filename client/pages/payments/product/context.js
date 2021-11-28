/**
 * WordPress Dependencies
 */
import { createContext, useContext } from '@wordpress/element';

const ProductContext = createContext( {} );

const { Provider } = ProductContext;

export { Provider as ProductContextProvider };

const useProductContext = () => useContext( ProductContext );

export { ProductContext, useProductContext };

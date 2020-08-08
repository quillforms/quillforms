/**
 * WordPress Dependencies
 */
import {
	useState,
	createContext,
	createElement,
	useContext,
	FunctionComponentElement,
} from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { checkNameSpace, checkIsExit, checkIsNoExit } from './utils';
import {
	ContextProviderProps,
	ContextType,
	InitialStateContext,
	CreateContextOptions,
	NamespaceType,
	InitialState,
	DispatchContextType,
} from './interfaces';
const create = ( context: InitialStateContext = {} ) => {
	const globalContext = context;

	const deleteContext = ( namespace: NamespaceType ) => {
		checkNameSpace( namespace );
		globalContext[ namespace ] = null;
	};

	const createStateContext = ( {
		namespace,
		initialState,
	}: CreateContextOptions ) => {
		checkNameSpace( namespace );
		checkIsExit( namespace, globalContext );
		// create a store context
		const Context: ContextType = createContext( {} );
		const NativeProvider = Context.Provider;
		return ( { children }: any ) => {
			const [ state, dispatch ] = useState( initialState );

			Context.getState = () => state;

			// create a dispatch state context
			const DispatchContext = createContext( {
				dispatch,
				setState: ( state: InitialState ) =>
					dispatch( ( prevState: InitialState ) => ( {
						...prevState,
						...state,
					} ) ),
			} );

			globalContext[ namespace ] = {
				stateContext: Context,
				dispatchContext: DispatchContext,
			};

			return createElement( NativeProvider, { value: state }, children );
		};
	};

	const ContextProvider = (
		props: ContextProviderProps
	): FunctionComponentElement< any > => {
		const { namespace, initialState, children } = props;
		const Provider = createStateContext( { namespace, initialState } );
		return createElement( Provider, {}, children );
	};

	const useStateContext = ( namespace: NamespaceType ): any => {
		checkNameSpace( namespace );
		checkIsNoExit( namespace, globalContext );
		const store: any = globalContext[ namespace ];
		const context = store.stateContext;
		const state: Object = useContext( context );
		return {
			...state,
			getState: context.getState,
		};
	};
	const useDispatchContext = (
		namespace: NamespaceType
	): DispatchContextType => {
		checkNameSpace( namespace );
		checkIsNoExit( namespace, globalContext );
		const store: any = globalContext[ namespace ];
		const context = store.dispatchContext;
		return useContext( context );
	};

	const useGlobalContext = () => {
		return Object.keys( globalContext ).reduce( ( p: any, key ) => {
			// only get the state
			p[ key ] = {
				...useStateContext( key ),
				...useDispatchContext( key ),
			};
			return p;
		}, {} );
	};
	return {
		useContext: useStateContext,
		useDispatchContext,
		useGlobalContext,
		globalContext,
		deleteContext,
		ContextProvider,
		createContext: createStateContext,
	};
};

export default create;

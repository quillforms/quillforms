import React, { createElement } from 'react';
import { createContext, useDispatchContext } from './index';
import { wrap } from './utils';
import { StoreProviderProps, DispatchProviderType } from './interfaces';
export const DispatchProvider = ( props: DispatchProviderType ) => {
	const { C, namespace, children } = props;
	const dispatchProps = useDispatchContext( namespace );
	return <C { ...dispatchProps }>{ children }</C>;
};

export default ( props: StoreProviderProps ) => {
	const { reducers, namespace, children } = props;
	const Store = Object.keys( reducers ).reduce( ( C, key ) => {
		const reduce = reducers[ key ];
		const reducerNamespace = `${ namespace }.${ key }`;
		const StateProvider = createContext( {
			namespace: reducerNamespace,
			initialState: {},
		} );

		return ( WrapProps: any ) => (
			<C>
				<StateProvider>
					<DispatchProvider
						C={ reduce }
						namespace={ reducerNamespace }
					>
						{ WrapProps.children }
					</DispatchProvider>
				</StateProvider>
			</C>
		);
	}, wrap );

	return createElement( Store, {}, children );
};

import * as React from 'react';

export type InitialStateContext = {
	[ index: string ]:
		| null
		| undefined
		| {
				dispatchContext: any;
				stateContext: ContextType;
		  };
};

export type InitialState = any;

export type NamespaceType = string;

export interface CreateContextOptions {
	namespace: NamespaceType;
	initialState: InitialState;
}

export interface DispatchContextType {
	setState: ( obj: InitialState ) => void;
	dispatch: React.SetStateAction< InitialState >;
}

export type Reduce = ( props: any ) => React.ReactNode;

export interface ContextType extends React.Context< object > {
	getState?: () => InitialState;
}

export interface ContextProviderProps
	extends React.PropsWithChildren< CreateContextOptions > {}

export interface StoreProviderProps
	extends React.PropsWithChildren< {
		reducers: {
			[ index: string ]: Reduce;
		};
		namespace: NamespaceType;
	} > {}

export interface DispatchProviderType
	extends React.PropsWithChildren< {
		C: any;
		namespace: NamespaceType;
	} > {}

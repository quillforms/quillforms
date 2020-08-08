import { NamespaceType, InitialStateContext } from './interfaces';
import { PropsWithChildren } from 'react';
export const wrap = ( props: PropsWithChildren< any > ): any => {
	return props.children;
};

export const checkNameSpace = ( namespace: NamespaceType ) => {
	if ( ! namespace ) {
		throw new Error(
			`expect get the namespace ,but get ${ typeof namespace }`
		);
	}
};
export const checkIsExit = (
	namespace: NamespaceType,
	globalContext: InitialStateContext
) => {
	if ( globalContext[ namespace ] ) {
		throw new Error( 'the Context has mounted' );
	}
};

export const checkIsNoExit = (
	namespace: NamespaceType,
	globalContext: InitialStateContext
) => {
	if ( ! globalContext[ namespace ] ) {
		throw new Error( 'the Context did not mounted' );
	}
};

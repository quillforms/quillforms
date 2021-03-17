/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'rememo' {
	export default function <
		// Need to use 'any' rather than 'unknown' here as it has
		// The correct Generic narrowing behaviour.
		ResultFn extends (
			this: any,
			...newArgs: any[]
		) => ReturnType< ResultFn >
	>(
		resultFn: ResultFn,
		getDependants: ( ...newArgs: any[] ) => any
	): ResultFn;
}

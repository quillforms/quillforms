/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BlockRenderContextProvider, useBlockRenderContext } from './context';
import FieldWrapper from '../field-wrapper';

export { useBlockRenderContext };

export default function BlockRender( props ) {
	const { type, isSelected, blockId, attributes } = props;
	const context = {
		type,
		isSelected,
		blockId,
		attributes,
	};
	return (
		<BlockRenderContextProvider
			// It is important to return the same object if props haven't
			// changed to avoid  unnecessary rerenders.
			// See https://reactjs.org/docs/context.html#caveats.
			value={ useMemo( () => context, Object.values( context ) ) }
		>
			<FieldWrapper { ...props } />
		</BlockRenderContextProvider>
	);
}

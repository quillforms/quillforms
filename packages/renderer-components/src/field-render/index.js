/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { FieldRenderContextProvider, useFieldRenderContext } from './context';
import FieldWrapper from '../field-wrapper';

export { useFieldRenderContext };

export default function FieldRender( {
	field,
	isAnimating,
	isFocused,
	counter,
	isActive,
	animation,
	setCanGoNext,
	setCanGoPrev,
	next,
} ) {
	const { id, type, attributes, title, description, attachment } = field;
	const context = {
		id,
		type,
		attributes,
		title,
		description,
		attachment,
		isAnimating,
		counter,
		isActive,
	};
	return (
		<FieldRenderContextProvider
			// It is important to return the same object if props haven't
			// changed to avoid  unnecessary rerenders.
			// See https://reactjs.org/docs/context.html#caveats.
			value={ useMemo( () => context, Object.values( context ) ) }
		>
			<FieldWrapper
				isFocused={ isFocused }
				animation={ animation }
				setCanGoNext={ setCanGoNext }
				setCanGoPrev={ setCanGoPrev }
				next={ next }
			/>
		</FieldRenderContextProvider>
	);
}

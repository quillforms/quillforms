/**
 * WordPress dependencies
 */
import { useMemo, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
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
	isActive,
	animation,
	setCanGoNext,
	setCanGoPrev,
	next,
	shouldBeRendered,
} ) {
	const [ blockFooterArea, setBlockFooterArea ] = useState( '' );
	const { id, name, attributes } = field;
	// console.log( id, name, attributes );
	const { isReviewing, isValid } = useSelect( ( select ) => {
		return {
			isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
			isValid: select( 'quillForms/renderer-submission' ).isValidField(
				id
			),
		};
	} );

	useEffect( () => {
		if ( isReviewing && ! isValid ) {
			setBlockFooterArea( 'error-message' );
		}
	}, [ isReviewing ] );
	const context = {
		id,
		blockName: name,
		attributes,
		isAnimating,
		isActive,
		shouldBeRendered,
		blockFooterArea,
		setBlockFooterArea,
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

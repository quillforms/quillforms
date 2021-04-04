import { useTrace } from '@quillforms/utils';
/**
 * WordPress dependencies
 */
import { useState, useEffect, memo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
/**
 * Internal dependencies
 */
import { FieldRenderContextProvider, useFieldRenderContext } from './context';
import FieldWrapper from '../field-wrapper';

export { useFieldRenderContext };

interface Props {
	id: string;
	isFocused: boolean;
	isActive: boolean;
	shouldBeRendered: boolean;
}

const FieldRender: React.FC< Props > = memo( ( props ) => {
	const { id, isFocused, isActive, shouldBeRendered } = props;
	useTrace( props );
	const [ blockFooterArea, setBlockFooterArea ] = useState<
		undefined | 'error-message' | 'submit-btn'
	>( undefined );
	// console.log( id, name, attributes );
	const { isReviewing, isValid, block } = useSelect( ( select ) => {
		return {
			isReviewing: select( 'quillForms/renderer-core' ).isReviewing(),
			isValid: select( 'quillForms/renderer-core' ).isValidField( id ),
			block: select( 'quillForms/renderer-core' ).getBlockById( id ),
		};
	} );

	useEffect( () => {
		if ( isReviewing && ! isValid ) {
			setBlockFooterArea( 'error-message' );
		}
	}, [ isReviewing ] );

	const { goNext } = useDispatch( 'quillForms/renderer-core' );
	console.log( block );
	if ( ! block ) return null;
	const { name, attributes } = block;

	const context = {
		id,
		blockName: name,
		attributes,
		isActive,
		shouldBeRendered,
		blockFooterArea,
		setBlockFooterArea,
		next: goNext,
		isFocused,
	};
	return (
		<FieldRenderContextProvider value={ context }>
			<FieldWrapper />
		</FieldRenderContextProvider>
	);
} );

export default FieldRender;

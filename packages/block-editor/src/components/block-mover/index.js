/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { BlockIconBox } from '@quillforms/builder-components';

const BlockMover = ( { id, type, registeredBlock, dragHandleProps } ) => {
	const { formStructure, editableFields } = useSelect( ( select ) => {
		return {
			formStructure: select(
				'quillForms/builder-core'
			).getFormStructure(),
			editableFields: select(
				'quillForms/builder-core'
			).getEditableFields(),
		};
	} );

	const charCode = 'a'.charCodeAt( 0 );

	// Simple algorithm to generate alphabatical idented order
	const identName = ( a ) => {
		const b = [ a ];
		let sp, out, i, div;

		sp = 0;
		while ( sp < b.length ) {
			if ( b[ sp ] > 25 ) {
				div = Math.floor( b[ sp ] / 26 );
				b[ sp + 1 ] = div - 1;
				b[ sp ] %= 26;
			}
			sp += 1;
		}

		out = '';
		for ( i = 0; i < b.length; i += 1 ) {
			out = String.fromCharCode( charCode + b[ i ] ) + out;
		}

		return out.toUpperCase();
	};

	let itemOrder = null;
	if ( registeredBlock.supports.displayOnly !== true ) {
		const fieldIndex = editableFields.findIndex(
			( field ) => field.id === id
		);
		itemOrder = fieldIndex + 1;
	} else {
		const fieldIndex = formStructure
			.filter( ( block ) => block.type === type )
			.findIndex( ( block ) => block.id === id );
		itemOrder = identName( fieldIndex );
	}

	return (
		<div className="block-editor-block-mover" { ...dragHandleProps }>
			<BlockIconBox blockType={ type } blockOrder={ itemOrder } />
		</div>
	);
};

export default BlockMover;

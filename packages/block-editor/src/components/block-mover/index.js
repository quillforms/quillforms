/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import { BlockIconBox } from '@quillforms/builder-components';

const BlockMover = ( {
	id,
	type,
	category,
	registeredBlock,
	dragHandleProps,
} ) => {
	const { thankyouScreens, fields, editableFields } = useSelect(
		( select ) => {
			return {
				thankyouScreens: select(
					'quillForms/builder-core'
				).getThankyouScreens(),
				fields: select( 'quillForms/builder-core' ).getFields(),
				editableFields: select(
					'quillForms/builder-core'
				).getEditableFields(),
			};
		}
	);

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
	if ( category === 'fields' ) {
		if ( registeredBlock.supports.displayOnly !== true ) {
			const fieldIndex = editableFields.findIndex(
				( field ) => field.id === id
			);
			itemOrder = fieldIndex + 1;
		} else {
			const fieldIndex = fields
				.filter( ( field ) => field.type === type )
				.findIndex( ( field ) => field.id === id );
			itemOrder = identName( fieldIndex );
		}
	} else if ( category === 'thankyouScreens' ) {
		const blockIndex = thankyouScreens.findIndex(
			( block ) => block.id === id
		);
		itemOrder = identName( blockIndex );
	}

	return (
		<div className="block-editor-block-mover" { ...dragHandleProps }>
			<BlockIconBox blockType={ type } blockOrder={ itemOrder } />
		</div>
	);
};

export default BlockMover;

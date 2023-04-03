import { FormBlock, FormBlocks } from '@quillforms/types';

const useFlattenedBlocks = ( blocks ) => {
	const result: FormBlocks = [];

	const stack = [ ...blocks ];
	while ( stack.length ) {
		const { innerBlocks, ...block } = stack.shift();
		if ( innerBlocks ) {
			stack.push( ...innerBlocks );
		}
		result.push( block );
	}

	return result;
};
export default useFlattenedBlocks;

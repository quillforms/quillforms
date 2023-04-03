import { FormBlock, FormBlocks } from '@quillforms/types/src';

const useFlattenedBlocks = ( blocks ) => {
	const result: FormBlocks = [];

	const stack = [ ...blocks ];
	while ( stack.length ) {
		const { innerBlocks, ...block } = stack.shift();
		if ( innerBlocks ) {
			stack.push( ...innerBlocks );
		}
		result.push( <FormBlock>block );
	}

	return result;
};
export default useFlattenedBlocks;

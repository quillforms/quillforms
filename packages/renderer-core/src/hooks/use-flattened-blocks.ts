import { forEach } from 'lodash';

const useFlattenedBlocks = ( blocks ) => {
	const result = [];

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

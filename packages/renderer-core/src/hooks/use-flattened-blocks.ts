import useBlocks from './use-blocks';
import { forEach } from 'lodash';

const useFlattenedBlocks = () => {
	const blocks = useBlocks();
	const result = [];

	const stack = [ ...blocks ];
	while ( stack.length ) {
		const { innerBlocks, ...block } = stack.shift();
		if ( innerBlocks ) {
			forEach( innerBlocks, ( $block, index ) => {
				innerBlocks[ index ] = {
					...$block,
				};
			} );
			stack.push( ...innerBlocks );
		}
		result[ block.id ] = block;
	}

	return result;
};
export default useFlattenedBlocks;

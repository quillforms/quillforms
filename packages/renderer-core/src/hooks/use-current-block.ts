/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import useBlocks from './use-blocks';

const useCurrentBlock = () => {
	const blocks = useBlocks();
	const { currentBlockId } = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/renderer-core'
			).getCurrentBlockId(),
		};
	} );

	return blocks.find( ( block ) => block.id === currentBlockId );
};

export default useCurrentBlock;

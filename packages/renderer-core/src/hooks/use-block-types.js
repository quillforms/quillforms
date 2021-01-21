/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useBlockTypes = () => {
	const { blockTypes } = useSelect( ( select ) => {
		return {
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	return blockTypes;
};

export default useBlockTypes;

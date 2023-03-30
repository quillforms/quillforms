/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

const useGoToBlock = ( blockId: string ) => {
	const { goToBlock } = useDispatch( 'quillForms/renderer-core' );
	return goToBlock( blockId );
};

export default useGoToBlock;

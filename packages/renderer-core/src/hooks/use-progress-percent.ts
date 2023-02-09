/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import useFlattenedBlocks from './use-flattened-blocks';

const useProgressPerecent = () => {
	const { answers, walkPath, blockTypes } = useSelect( ( select ) => {
		return {
			walkPath: select( 'quillForms/renderer-core' ).getWalkPath(),
			answers: select( 'quillForms/renderer-core' ).getAnswers(),
			blockTypes: select( 'quillForms/blocks' ).getBlockTypes(),
		};
	} );
	const allBlocks = useFlattenedBlocks( walkPath );
	let editableBlocksLength = 0;
	let answered = 0;
	allBlocks.forEach( ( field ) => {
		if ( blockTypes[ field.name ]?.supports.editable ) {
			editableBlocksLength++;
			if ( answers[ field.id ]?.value ) {
				answered++;
			}
		}
	} );
	const getPercent = () => {
		const percent = Math.round( ( answered * 100 ) / editableBlocksLength );
		if ( isNaN( percent ) ) return 0;
		return percent;
	};

	return getPercent();
};

export default useProgressPerecent;

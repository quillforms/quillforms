/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';
import { useCallback } from '@wordpress/element';

const useProgressPerecent = () => {
	const { answered, isAnimating, totalQuestions } = useSelect( ( select ) => {
		return {
			answered: select(
				'quillForms/renderer-submission'
			).getAnsweredFieldsLength(),
			isAnimating: select( 'quillForms/renderer-core' ).isAnimating(),
			totalQuestions: select(
				'quillForms/renderer-core'
			).getEditableFieldsInCurrentPath()?.length,
		};
	} );
	const getPercent = useCallback( () => {
		const percent = Math.round( ( answered * 100 ) / totalQuestions );
		if ( isNaN( percent ) ) return 0;
		return percent;
	}, [ isAnimating ] );

	return getPercent();
};

export default useProgressPerecent;

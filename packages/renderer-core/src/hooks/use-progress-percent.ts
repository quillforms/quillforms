/**
 * WordPress Dependencies
 */
import { useSelect } from '@wordpress/data';

const useProgressPerecent = () => {
	const { answered, totalQuestions } = useSelect( ( select ) => {
		return {
			answered: select(
				'quillForms/renderer-core'
			).getAnsweredFieldsLength(),
			isAnimating: select( 'quillForms/renderer-core' ).isAnimating(),
			totalQuestions: select(
				'quillForms/renderer-core'
			).getEditableFieldsInCurrentPath()?.length,
		};
	} );
	const getPercent = () => {
		const percent = Math.round( ( answered * 100 ) / totalQuestions );
		if ( isNaN( percent ) ) return 0;
		return percent;
	};

	return getPercent();
};

export default useProgressPerecent;

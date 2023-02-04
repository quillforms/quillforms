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

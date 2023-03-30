/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

const useAnswersResetter = () => {
	const { resetAnswers } = useDispatch( 'quillForms/renderer-core' );
	return resetAnswers();
};

export default useAnswersResetter;

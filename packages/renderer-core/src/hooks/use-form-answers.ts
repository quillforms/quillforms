import { useSelect } from '@wordpress/data';
const useFormAnswers = () => {
	const { answers } = useSelect( ( select ) => {
		return {
			answers: select( 'quillForms/renderer-core' ).getAnswers(),
		};
	} );

	return answers;
};

export default useFormAnswers;

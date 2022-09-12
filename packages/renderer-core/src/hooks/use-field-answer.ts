import { useSelect } from '@wordpress/data';
const useFieldAnswer = ( id ) => {
	const { fieldAnswer } = useSelect( ( select ) => {
		return {
			fieldAnswer: select( 'quillForms/renderer-core' ).getFieldAnswerVal(
				id
			),
		};
	} );

	return fieldAnswer;
};

export default useFieldAnswer;

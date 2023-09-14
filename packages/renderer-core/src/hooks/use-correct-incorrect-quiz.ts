import useFormContext from './use-form-context';

const useCorrectIncorrectQuiz = () => {
	const {
		formObj: { correctIncorrectQuiz },
	} = useFormContext();
	return correctIncorrectQuiz;
};

export default useCorrectIncorrectQuiz;

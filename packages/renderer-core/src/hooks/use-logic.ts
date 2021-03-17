import useFormContext from './use-form-context';

const useLogic = () => {
	const {
		formObj: { logic },
	} = useFormContext();
	return logic;
};

export default useLogic;

import useFormContext from './use-form-context';

const useHiddenFields = () => {
	const {
		formObj: { hiddenFields },
	} = useFormContext();
	return hiddenFields;
};

export default useHiddenFields;

import useFormContext from './use-form-context';

const useTheme = () => {
	const {
		formObj: { theme },
	} = useFormContext();
	return theme;
};

export default useTheme;

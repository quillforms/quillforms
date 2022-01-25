import useFormContext from './use-form-context';

const useFormSettings = () => {
	const {
		formObj: { settings },
	} = useFormContext();
	return settings;
};

export default useFormSettings;

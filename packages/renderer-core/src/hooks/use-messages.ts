import useFormContext from './use-form-context';

const useMessages = () => {
	const {
		formObj: { messages },
	} = useFormContext();
	return messages;
};

export default useMessages;

/**
 * Internal Dependencies
 */
import { FormContextProvider } from '../form-context';
import FormWrapper from '../form-wrapper';

const Form = ( { formObj, onSubmit, applyLogic, isPreview = false } ) => {
	return (
		<FormContextProvider value={ { formObj, onSubmit } }>
			<FormWrapper applyLogic={ applyLogic } isPreview={ isPreview } />
		</FormContextProvider>
	);
};

export default Form;

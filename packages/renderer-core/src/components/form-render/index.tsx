/**
 * Internal Dependencies
 */
import { FormContextProvider } from '../form-context';
import FormWrapper from '../form-wrapper';
import type { FormObj } from '../../types';

interface Props {
	formObj: FormObj;
	onSubmit: () => void;
	applyLogic: boolean;
	isPreview: boolean;
}
const Form: React.FC< Props > = ( {
	formObj,
	onSubmit,
	applyLogic,
	isPreview = false,
} ) => {
	return (
		<FormContextProvider value={ { formObj, onSubmit } }>
			<FormWrapper applyLogic={ applyLogic } isPreview={ isPreview } />
		</FormContextProvider>
	);
};

export default Form;

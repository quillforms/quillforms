/**
 * QuillForms Dependencies
 */
import { sanitizeBlocks } from '@quillforms/blocks';
import {
	getDefaultMessages,
	getDefaultThemeProperties,
} from '@quillforms/utils';

/**
 * WordPress Dependencies
 */
import { useEffect } from '@wordpress/element';
import { doAction } from '@wordpress/hooks';

/**
 * Internal Dependencies
 */
import { FormContextProvider } from '../form-context';
import FormWrapper from '../form-wrapper';
import type { FormObj } from '../../types';

interface Props {
	formId: number;
	formObj: FormObj;
	onSubmit: () => void;
	applyLogic: boolean;
	isPreview: boolean;
}
const Form: React.FC< Props > = ( {
	formObj,
	formId,
	onSubmit,
	applyLogic,
	isPreview = false,
} ) => {
	// This
	const formatFormObj = ( formObj: FormObj ): FormObj => {
		// If not in preview mode, sanitize blocks.
		// In preview mode, sanitizing is already done in block editor resolvers.
		if ( ! isPreview ) {
			formObj.blocks = sanitizeBlocks( formObj.blocks );
		}
		formObj.theme = {
			...getDefaultThemeProperties(),
			...formObj.theme,
		};

		formObj.messages = {
			...getDefaultMessages(),
			...formObj.messages,
		};
		return formObj;
	};

	useEffect( () => {
		doAction( 'QuillForms.RendererCore.Loaded' );
	}, [] );

	return (
		<FormContextProvider
			value={ {
				formObj: formatFormObj( formObj ),
				onSubmit,
				isPreview,
				formId,
			} }
		>
			<FormWrapper applyLogic={ applyLogic } />
		</FormContextProvider>
	);
};

export default Form;

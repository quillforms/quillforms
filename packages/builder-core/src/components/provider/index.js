/**
 * QuillForms Dependencies
 */
import { GlobalEditorContextProvider } from '@quillforms/builder-components';

/**
 * Internal Dependencies
 */
import Layout from '../layout';

const EditorProvider = () => {
	return (
		<GlobalEditorContextProvider value={ window.qfEditorContext }>
			<Layout />
		</GlobalEditorContextProvider>
	);
};

export default EditorProvider;

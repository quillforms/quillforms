/**
 * QuillForms Dependencies
 */
import { GlobalEditorContextProvider } from '@quillforms/admin-components';
import { useMemo } from '@wordpress/element';
/**
 * Internal Dependencies
 */
import Layout from '../layout';

const EditorProvider = () => {
	return (
		<GlobalEditorContextProvider
			value={ useMemo(
				() => window.qfEditorContext,
				Object.values( window.qfEditorContext )
			) }
		>
			<Layout />
		</GlobalEditorContextProvider>
	);
};

export default EditorProvider;

import { withHistory, withMergeTags, withLinks, withReact } from './plugins';
import { createEditor as createSlateEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { CustomEditor } from './types';
import { withCustomNormalization } from './plugins';

const createEditor = (): ReactEditor & HistoryEditor => {
	const editor: CustomEditor = createSlateEditor() as CustomEditor;

	return withMergeTags(
		// @ts-ignore
		withHistory(withLinks(withReact(editor)))
	) as ReactEditor & HistoryEditor;
};
export default createEditor;

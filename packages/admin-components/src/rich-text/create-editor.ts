import { withHistory, withMergeTags, withLinks, withReact } from './plugins';
import { createEditor as createSlateEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { CustomEditor } from './types';

const createEditor = (): ReactEditor & HistoryEditor => {
	let editor: CustomEditor = createSlateEditor() as CustomEditor;

	return withMergeTags(
		// @ts-expect-error
		withHistory( withLinks( withReact( editor ) ) )
	) as ReactEditor & HistoryEditor;
};
export default createEditor;

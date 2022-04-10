import { withHistory, withMergeTags, withLinks, withReact } from './plugins';
import { createEditor as createSlateEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

const createEditor = (): ReactEditor & HistoryEditor => {
	let editor = createSlateEditor();

	return withMergeTags(
		withHistory( withLinks( withReact( editor ) ) )
	) as ReactEditor & HistoryEditor;
};
export default createEditor;

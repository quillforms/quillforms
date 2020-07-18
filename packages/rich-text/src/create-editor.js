import * as plugins from './plugins';
import { createEditor as createSlateEditor } from 'slate';

const createEditor = ( options ) => {
	let editor = createSlateEditor();
	for ( const plugin in plugins ) {
		if ( options[ plugin ] ) {
			editor = plugins[ plugin ]( editor );
		}
	}
	return editor;
};
export default createEditor;

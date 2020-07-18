import focus from './focus';
import { Transforms, Editor } from 'slate';

const moveFocusToEnd = ( editor ) => {
	focus( editor );
	Transforms.select( editor, Editor.end( editor, [] ) );
};

export default moveFocusToEnd;

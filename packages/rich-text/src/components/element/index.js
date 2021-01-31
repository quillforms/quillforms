/**
 * External Dependencies
 */
import { ReactEditor } from 'slate-react';

/**
 * Internal Dependencies
 */
import MergeTag from '../merge-tag';

const Element = ( props ) => {
	const { attributes, children, element, editor, mergeTags } = props;
	const path = ReactEditor.findPath( editor, element );

	if ( element.type === 'mergeTag' ) {
		return (
			<MergeTag
				type={ element.data.type }
				modifier={ element.data.modifier }
				mergeTags={ mergeTags }
				editor={ editor }
				path={ path }
				{ ...props }
			/>
		);
	} else if ( element.type === 'link' ) {
		return (
			<a { ...attributes } href={ element.url }>
				{ children }
			</a>
		);
	}
	return <p { ...attributes }>{ children }</p>;
};
export default Element;

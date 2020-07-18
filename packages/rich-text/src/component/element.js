/**
 * External Dependencies
 */
import { ReactEditor } from 'slate-react';

/**
 * Internal Dependencies
 */
import Variable from './variable';
import FieldVariable from './field-variable';

const Element = ( props ) => {
	const { attributes, children, element, editor } = props;
	const path = ReactEditor.findPath( editor, element );

	if ( element.type === 'variable' ) {
		if ( element.data.varType === 'field' ) {
			return (
				<FieldVariable
					fieldRef={ element.data.ref }
					editor={ editor }
					path={ path }
					{ ...props }
				/>
			);
		}
		return <Variable path={ path } editor={ editor } { ...props } />;
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

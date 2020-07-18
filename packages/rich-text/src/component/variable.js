/**
 * External Dependencies
 */
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { Editor } from 'slate';

const EditorVariable = ( props ) => {
	const { element, attributes, editor, children, path } = props;
	const [ node ] = Editor.node( editor, path );

	const { data } = element;

	return (
		<span
			{ ...attributes }
			contentEditable={ false }
			style={ {
				color: '#3a7685',
				borderColor: '#3a7685',
				fill: '#3a7685',
			} }
			className="rich-text-variable__node-wrapper"
		>
			<span
				className="rich-text-variable__background"
				style={ { background: '#3a7685' } }
			/>
			<span className="rich-text-variable__icon-box">
				<AddIcon />
			</span>
			<span className="rich-text-variable__title">{ data.ref }</span>
			<button
				className="rich-text-variable__delete"
				onClick={ () => {
					setTimeout( () => {
						editor.apply( {
							type: 'remove_node',
							path,
							node,
						} );
					}, 0 );
				} }
			>
				<CloseIcon />
			</button>
			{ children }
		</span>
	);
};
export default EditorVariable;

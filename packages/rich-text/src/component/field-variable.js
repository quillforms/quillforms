/**
 * WordPress Dependencies
 */
import { useEffect, Fragment } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External Dependencies
 */
import CloseIcon from '@material-ui/icons/Close';
import { Editor } from 'slate';

/**
 * Internal Dependencies
 */
import getPlainExcerpt from '../get-plain-excerpt';

const FieldVariable = ( props ) => {
	const { fieldRef, attributes, editor, children, path } = props;
	const [ node ] = Editor.node( editor, path );

	const { field, fieldTitle, block } = useSelect( ( select ) => {
		const blocks = select( 'quillForms/blocks' ).getBlocks();
		const fieldObj = select( 'quillForms/block-editor' ).getBlockById(
			fieldRef
		);

		return {
			field: fieldObj,
			fieldTitle: fieldObj ? getPlainExcerpt( fieldObj.title ) : null,
			block: fieldObj?.type ? blocks[ fieldObj.type ] : null,
		};
	} );

	// Remove field variable if the field isn't exisiting
	useEffect( () => {
		if ( ! field || block?.supports?.displayOnly ) {
			editor.apply( { type: 'remove_node', path, node } );
		}
	}, [ field ] );

	return (
		<Fragment>
			{ block && (
				<span
					{ ...attributes }
					contentEditable={ false }
					style={ {
						color: block.editorConfig.color,
						borderColor: block.editorConfig.color,
						fill: block.editorConfig.color,
					} }
					className="rich-text-variable__node-wrapper"
				>
					<span
						className="rich-text-variable__background"
						style={ { background: block.editorConfig.color } }
					/>
					<span className="rich-text-variable__icon-box">
						<block.editorConfig.icon />
					</span>
					<span
						className="rich-text-variable__title"
						dangerouslySetInnerHTML={ { __html: fieldTitle } }
					/>
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
			) }
		</Fragment>
	);
};
export default FieldVariable;

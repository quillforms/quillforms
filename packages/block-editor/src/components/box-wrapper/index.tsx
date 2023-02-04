/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import classnames from 'classnames';
interface Props {
	id: string;
	parentId?: string;
	isSelected: boolean;
}
const BoxWrapper: React.FC< Props > = ( {
	id,
	parentId,
	children,
	isSelected,
} ) => {
	const { setCurrentBlock, setCurrentChildBlock } = useDispatch(
		'quillForms/block-editor'
	);
	return (
		<div
			role="presentation"
			onClick={ ( e ) => {
				e.stopPropagation();
				if ( parentId ) {
					setCurrentBlock( parentId );
					setCurrentChildBlock( id );
				} else {
					setCurrentBlock( id );
				}
			} }
			id={ `block-editor-box-wrapper-${ id }` }
			className={ classnames( 'block-editor-box-wrapper', {
				isSelected,
			} ) }
		>
			{ children }
		</div>
	);
};
export default BoxWrapper;

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

interface Props {
	id: string;
}
const BoxWrapper: React.FC< Props > = ( { id, children } ) => {
	const { currentBlockId } = useSelect( ( select ) => {
		return {
			currentBlockId: select(
				'quillForms/block-editor'
			).getCurrentBlockId(),
		};
	} );

	const { setCurrentBlock } = useDispatch( 'quillForms/block-editor' );
	return (
		<div
			role="presentation"
			onClick={ () => {
				setCurrentBlock( id );
			} }
			className={
				'block-editor-box-wrapper' +
				( id === currentBlockId ? ' isSelected' : '' )
			}
		>
			{ children }
		</div>
	);
};
export default BoxWrapper;

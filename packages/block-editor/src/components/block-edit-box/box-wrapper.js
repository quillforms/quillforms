import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';

const BoxWrapper = ( { id, currentBlockId, setCurrentBlock, children } ) => {
	return (
		<div
			role="presentation"
			onClick={ ( e ) => {
				e.stopPropagation();
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
export default compose( [
	withSelect( ( select ) => {
		const { getCurrentBlockId } = select( 'quillForms/builder-core' );

		return {
			currentBlockId: getCurrentBlockId(),
		};
	} ),
	withDispatch( ( dispatch ) => {
		const { setCurrentBlock } = dispatch( 'quillForms/builder-core' );
		return {
			setCurrentBlock: ( id ) => setCurrentBlock( id ),
		};
	} ),
] )( BoxWrapper );

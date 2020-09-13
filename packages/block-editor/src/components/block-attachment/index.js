/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import CloseIcon from '@material-ui/icons/Close';

const BlockAttachment = ( { blockColor, attachment, id } ) => {
	const { setBlockAttachment } = useDispatch( 'quillForms/block-editor' );

	return (
		<div
			className="block-editor-block-attachment"
			style={ { borderColor: blockColor } }
		>
			<img
				alt=""
				className="block-editor-block-attachment__image"
				src={ attachment.url }
			/>
			<div
				role="presentation"
				className="block-editor-block-attachment__delete"
				onClick={ () => setBlockAttachment( id, {} ) }
			>
				<div
					className="block-editor-block-attachment__background-wrapper"
					style={ { backgroundColor: blockColor } }
				/>
				<CloseIcon style={ { color: blockColor } } />
			</div>
		</div>
	);
};

export default BlockAttachment;

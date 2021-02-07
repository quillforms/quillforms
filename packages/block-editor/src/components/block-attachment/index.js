/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { Icon } from '@wordpress/components';
import { close } from '@wordpress/icons';

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
				<Icon icon={ close } style={ { color: blockColor } } />
			</div>
		</div>
	);
};

export default BlockAttachment;

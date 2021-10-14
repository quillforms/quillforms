import {
	TextControl,
	BaseControl,
	ControlWrapper,
	ControlLabel,
} from '@quillforms/admin-components';

import { useSelect, useDispatch } from '@wordpress/data';
const PostSlug = () => {
	const { setPostSlug } = useDispatch( 'quillForms/document-editor' );
	const { slug } = useSelect( ( select ) => {
		return {
			slug: select( 'quillForms/document-editor' ).getPostSlug(),
		};
	} );
	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label="Slug" />
				<TextControl
					value={ slug }
					onChange={ ( val ) => setPostSlug( val ) }
				/>
			</ControlWrapper>
		</BaseControl>
	);
};

export default PostSlug;

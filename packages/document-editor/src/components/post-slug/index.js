import {
	TextControl,
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
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
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Slug" />
				<TextControl
					value={ slug }
					onChange={ ( val ) => setPostSlug( val ) }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};

export default PostSlug;

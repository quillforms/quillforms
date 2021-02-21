import {
	TextControl,
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/admin-components';

import { useSelect, useDispatch } from '@wordpress/data';
const PostTitle = () => {
	const { setPostTitle } = useDispatch( 'quillForms/document-editor' );
	const { title } = useSelect( ( select ) => {
		return {
			title: select( 'quillForms/document-editor' ).getPostTitle(),
		};
	} );
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Title" />
				<TextControl
					value={ title }
					onChange={ ( val ) => setPostTitle( val ) }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};

export default PostTitle;

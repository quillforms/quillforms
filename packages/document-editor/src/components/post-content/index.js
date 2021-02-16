/**
 * QuillForms Dependencies
 */
import {
	__experimentalBaseControl,
	__experimentalControlWrapper,
	__experimentalControlLabel,
} from '@quillforms/builder-components';

import { RichTextControl } from '@quillforms/rich-text';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const PostContent = () => {
	const { setPostContent } = useDispatch( 'quillForms/document-editor' );
	const { content } = useSelect( ( select ) => {
		return {
			content: select( 'quillForms/document-editor' ).getPostContent(),
		};
	} );
	return (
		<__experimentalBaseControl>
			<__experimentalControlWrapper orientation="vertical">
				<__experimentalControlLabel label="Content while loading" />
				<RichTextControl
					className={ css`
						min-height: 120px !important;
					` }
					value={ content }
					onChange={ ( val ) => setPostContent( val ) }
				/>
			</__experimentalControlWrapper>
		</__experimentalBaseControl>
	);
};

export default PostContent;

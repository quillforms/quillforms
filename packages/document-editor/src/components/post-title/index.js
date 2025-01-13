import {
	TextControl,
	BaseControl,
	ControlWrapper,
	ControlLabel,
} from '@quillforms/admin-components';

import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
const PostTitle = () => {
	const { setPostTitle } = useDispatch('quillForms/document-editor');
	const { title } = useSelect((select) => {
		return {
			title: select('quillForms/document-editor').getPostTitle(),
		};
	});
	return (
		<BaseControl>
			<ControlWrapper orientation="vertical">
				<ControlLabel label={__('Title', 'quillforms')} />
				<TextControl
					value={title}
					onChange={(val) => setPostTitle(val)}
				/>
			</ControlWrapper>
		</BaseControl>
	);
};

export default PostTitle;

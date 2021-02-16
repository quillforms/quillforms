/**
 * Internal Dependencies
 */
import PostTitle from '../post-title';
import PostSlug from '../post-slug';
import PostContent from '../post-content';

const PanelRender = () => {
	return (
		<div className="document-editor-panel-render">
			<PostTitle />
			<PostContent />
			<PostSlug />
		</div>
	);
};
export default PanelRender;

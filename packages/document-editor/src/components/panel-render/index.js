/**
 * Internal Dependencies
 */
import PostTitle from '../post-title';
import PostSlug from '../post-slug';

const PanelRender = () => {
	return (
		<div className="document-editor-panel-render">
			<PostTitle />
			<PostSlug />
		</div>
	);
};
export default PanelRender;

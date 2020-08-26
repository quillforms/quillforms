/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
const BlockTitle = ( props ) => {
	let { title } = props;
	if ( ! title || title === '<p></p>' ) {
		title = '<p>...</p>';
	}
	return (
		<div className="renderer-components-block-title">
			<HtmlParser
				className="renderer-components-block-title__content"
				value={ title }
			/>
		</div>
	);
};
export default BlockTitle;

/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
const BlockTitle = ( props ) => {
	const { title } = props;

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

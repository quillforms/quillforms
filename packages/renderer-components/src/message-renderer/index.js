/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
const MessageRenderer = ( { value } ) => {
	return (
		<div className="renderer-components-message-renderer">
			{ HtmlParser( value ) }
		</div>
	);
};

export default MessageRenderer;

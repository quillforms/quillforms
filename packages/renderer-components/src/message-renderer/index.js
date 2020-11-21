/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
const MessageRenderer = ( { value } ) => {
	return <>{ HtmlParser( value ) }</>;
};

export default MessageRenderer;

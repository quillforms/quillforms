/**
 * Internal Dependencies
 */
import HtmlParser from '../html-parser';
interface Props {
	value: string;
}
const MessageRenderer: React.FC< Props > = ( { value } ) => {
	return <HtmlParser value={ value } />;
};

export default MessageRenderer;

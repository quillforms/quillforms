import { Node } from 'slate';
// Get plain text from JSON value
const getPlainText = ( nodes ) => {
	return nodes.map( ( n ) => Node.string( n ) ).join( '\n' );
};

export default getPlainText;

/**
 * External Dependencies
 */
import escapeHtml from 'escape-html';
import { Text } from 'slate';

const serialize = ( node ) => {
	let nodeText = escapeHtml( node.text );
	if ( Text.isText( node ) ) {
		if ( node.bold ) {
			nodeText = `<strong>` + nodeText + `</strong>`;
		}

		if ( node.italic ) {
			nodeText = `<em>` + nodeText + `</em>`;
		}

		return nodeText;
	}

	if ( Array.isArray( node ) ) {
		return node
			.map( ( subNode ) => serializeLeafNode( subNode ) )
			.join( '' );
	}

	return serializeLeafNode( node );
};

const serializeLeafNode = ( node ) => {
	const children = node.children.map( ( n ) => serialize( n ) ).join( '' );
	switch ( node.type ) {
		case 'link':
			return `<a href="${ escapeHtml( node.url ) }">${ children }</a>`;
		case 'variable':
			return `{{${ node.data.varType }:${ node.data.ref }}}`;
		case 'paragraph':
			return `<p>${ children }</p>`;
		default:
			return `${ children }`;
	}
};

export default serialize;

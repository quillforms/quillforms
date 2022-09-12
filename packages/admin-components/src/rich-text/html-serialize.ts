/**
 * WordPress Dependencies
 */
import { removep } from '@wordpress/autop';

/**
 * External Dependencies
 */
import escapeHtml from 'escape-html';
import { Text, Node } from 'slate';

/**
 * Internal Dependencies
 */
import type { CustomNode, MergeTag } from './types';
const htmlSerialize = ( value: Node ): string => {
	return removep( serialize( value ) );
};
const serialize = ( node: CustomNode ) => {
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
		return node.map( ( subNode ) => serializeNode( subNode ) ).join( '' );
	}

	return serializeNode( node );
};

const serializeNode = ( node: CustomNode ) => {
	const children = node.children.map( ( n ) => serialize( n ) ).join( '' );
	switch ( node.type ) {
		case 'link':
			return `<a target="_blank" href="${ escapeHtml(
				node.url
			) }">${ children }</a>`;
		case 'mergeTag':
			return `{{${ ( node.data as MergeTag ).type }:${
				( node.data as MergeTag ).modifier
			}}}`;
		case 'paragraph':
			return `<p>${ children }</p>`;
		default:
			return `${ children }`;
	}
};

export default htmlSerialize;

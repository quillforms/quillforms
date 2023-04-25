/**
 * WordPress Dependencies
 */
// import { removep } from '@wordpress/autop';

/**
 * External Dependencies
 */
import escapeHtml from 'escape-html';
import { Text, Node } from 'slate';

/**
 * Internal Dependencies
 */
import type { CustomNode, MergeTag } from './types';
import { size } from 'lodash';
const htmlSerialize = ( value: Node ): string => {
	return serialize( value ).replaceAll("<br />{{}}, ");
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

		if ( nodeText === '' ) {
			return '<br />';
		}

		return nodeText;
	}

	if ( Array.isArray( node ) ) {
		return node.map( ( subNode, i ) => {
			return serializeNode( subNode ) 
		} ).join( '' );
		
	}

	return serializeNode( node );
};

const serializeNode = ( node: CustomNode ) => {
	const children = node.children.map( ( n, i ) => { 
		if(size(node.children) > 1 && node.children[1]?.type === 'mergeTag' && i !== 1) {
			return "";
		}
		return serialize( n ) 
	}).join( '' );
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

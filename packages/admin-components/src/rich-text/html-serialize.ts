/**
 * WordPress Dependencies
 */
import { removep } from '@wordpress/autop';

/**
 * External Dependencies
 */
import escapeHtml from 'escape-html';
import { Text, Node } from 'slate';
import { size } from 'lodash';

/**
 * Internal Dependencies
 */
import type { CustomNode, MergeTag } from './types';

const htmlSerialize = (value: Node): string => {
	return removep(serialize(value));
};

const serialize = (node: CustomNode) => {
	if (Text.isText(node)) {
		let nodeText = escapeHtml(node.text);

		// Handle consecutive line breaks differently
		nodeText = nodeText.replace(/\n\n+/g, '<br /><br />'); // Two or more breaks
		nodeText = nodeText.replace(/\n/g, '<br />'); // Single breaks

		if (node.bold) {
			nodeText = `<strong>${nodeText}</strong>`;
		}

		if (node.italic) {
			nodeText = `<em>${nodeText}</em>`;
		}

		if (nodeText === '') {
			return '<br />';
		}

		return nodeText;
	}

	if (Array.isArray(node)) {
		return node
			.map((subNode) => {
				return serializeNode(subNode);
			})
			.join('');
	}

	return serializeNode(node);
};

const serializeNode = (node: CustomNode) => {
	const children =
		size(node.children) > 0
			? node.children.map((n) => serialize(n)).join('')
			: '';

	switch (node.type) {
		case 'link':
			return `<a target="_blank" href="${escapeHtml(node.url)}">${children}</a>`;
		case 'mergeTag':
			return `{{${(node.data as MergeTag).type}:${(node.data as MergeTag).modifier
				}}}`;
		case 'paragraph':
			// Add double line break after paragraphs for better spacing
			return `<p>${children}</p>\n\n`;
		default:
			return `${children}`;
	}
};

export default htmlSerialize;
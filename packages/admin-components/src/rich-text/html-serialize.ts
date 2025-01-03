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

const customRemovep = (html: string): string => {
	// First, convert standalone </p><p> to line breaks
	let processed = html.replace(/<\/p>\s*<p>/g, '<br />');

	// Convert empty paragraphs to line breaks while preserving consecutive ones
	processed = processed.replace(/<p><\/p>/g, '<br />');

	// Remove paragraph tags but maintain their content
	processed = processed.replace(/<p>(.*?)<\/p>/g, '$1');

	// Preserve multiple consecutive <br /> tags
	processed = processed.replace(/(<br\s*\/?>\s*){2,}/g, (match) => {
		// Count the number of <br /> tags and preserve them
		const count = (match.match(/<br\s*\/?>/g) || []).length;
		return Array(count).fill('<br />').join('');
	});

	return processed;
};

const htmlSerialize = (value: Node): string => {
	const serialized = serialize(value);
	//console.log('Before customRemovep:', serialized);
	const result = customRemovep(serialized);
	//console.log('After customRemovep:', result);
	return result;
};

const serialize = (node: CustomNode) => {
	if (Text.isText(node)) {
		let nodeText = escapeHtml(node.text);

		// Convert newlines to <br />
		nodeText = nodeText.replace(/\n/g, '<br />');

		if (node.textColor) {
			nodeText = `<span style="color: ${node.textColor};">${nodeText}</span>`;
		}

		if (node.bold) {
			nodeText = `<strong>${nodeText}</strong>`;
		}

		if (node.italic) {
			nodeText = `<em>${nodeText}</em>`;
		}

		return nodeText || '';
	}

	if (Array.isArray(node)) {
		return node.map((subNode) => serialize(subNode)).join('');
	}

	return serializeNode(node);
};

const serializeNode = (node: CustomNode) => {
	const children = size(node.children) > 0
		? node.children.map((n) => serialize(n)).join('')
		: '';

	switch (node.type) {
		case 'link':
			return `<a target="_blank" href="${escapeHtml(node.url)}">${children}</a>`;
		case 'mergeTag':
			return `{{${(node.data as MergeTag).type}:${(node.data as MergeTag).modifier}}}`;
		case 'paragraph':
			return children.trim() ? `<p>${children}</p>` : '<p></p>';
		default:
			return children;
	}
};

export default htmlSerialize;
/**
 * External Dependencies
 */
import { jsx } from 'slate-hyperscript';
import { Editor, Node as SlateNode, Descendant, Text } from 'slate';
import { autop } from '@wordpress/autop';

/**
 * Internal Dependencies
 */
import createEditor from './create-editor';
import { MergeTag } from './types';

const deserializeHTML = (htmlString: string): SlateNode[] => {
	// First wrap the content in a paragraph if it doesn't start with one
	let processedHtml = htmlString.trim();
	if (!processedHtml.startsWith('<p>')) {
		processedHtml = `<p>${processedHtml}</p>`;
	}

	// Preserve multiple consecutive newlines
	processedHtml = processedHtml.replace(/\n\n+/g, (match) => {
		const count = match.length;
		// Create a string of empty paragraphs
		return '</p>' + '<p></p>'.repeat(count - 1) + '<p>';
	});

	// Wrap loose text in paragraphs
	processedHtml = processedHtml.replace(/(<\/p>|^)([^<]+)(<p>|$)/g, '$1<p>$2</p>$3');

	const deserialized = deserialize(
		new DOMParser().parseFromString(
			formatBeforeDeserializing(processedHtml),
			'text/html'
		).body
	);

	// Ensure we have valid slate nodes before normalizing
	const validNodes = ensureValidNodes(deserialized);
	return normalize(validNodes) as SlateNode[];
};

// Helper function to ensure valid Slate nodes
const ensureValidNodes = (nodes: any[]): SlateNode[] => {
	if (!Array.isArray(nodes)) {
		nodes = [nodes];
	}

	return nodes.filter(Boolean).map(node => {
		if (typeof node === 'string') {
			return {
				type: 'paragraph',
				children: [{ text: node }]
			};
		}
		if (!node.type && !node.text) {
			return {
				type: 'paragraph',
				children: [{ text: '' }]
			};
		}
		return node;
	});
};


const formatBeforeDeserializing = (value: string): string => {
	if (!value) {
		return '<p></p>';
	}

	// Handle merge tags
	let $value = value.replace(
		/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g,
		"<mergetag data-type='$1' data-modifier='$2'>_____</mergetag>"
	);

	return $value;
};


// Normalize to fix invalid JSON that may result from deserializing
// This custom normalizer should be called one time only after the component mounting
const normalize = (val: SlateNode[]): SlateNode[] => {
	// Create temp editor for normalizing
	const editor = createEditor();
	editor.children = val;
	console.log('before normalizing')
	Editor.normalize(editor, { force: true });
	console.log('after normalizing')
	return editor.children;
};

const deserialize = (el: HTMLElement | ChildNode) => {
	const TEXT_TAGS = {
		EM: () => ({ italic: true }),
		I: () => ({ italic: true }),
		STRONG: () => ({ bold: true }),
	};
	const ELEMENT_TAGS = {
		P: () => ({ type: 'paragraph' }),
		MERGETAG: () => ({
			type: 'mergeTag',
			data: {
				type: ((el as HTMLElement).dataset as MergeTag).type,
				modifier: ((el as HTMLElement).dataset as MergeTag).modifier,
			},
			children: [
				{
					text: '', // Default empty text for merge tags
					bold: false,
					italic: false,
					underline: false,
				},
			],
		}),
		SPAN: () => {
			// Handle spans with inline styles (e.g., color)
			const style = (el as HTMLElement).getAttribute('style');
			const colorMatch = style?.match(/color:\s*([^;]+);?/);
			const textColor = colorMatch ? colorMatch[1] : undefined;
			return textColor ? { textColor } : {};
		},
		A: () => ({
			type: 'link',
			url: (el as HTMLElement).getAttribute('href'),
		}),
	};

	// Handle plain text nodes
	if (el.nodeType === Node.TEXT_NODE) {
		if (el.textContent !== '\n') {
			return el.textContent; // Return the text content
		}
	}

	// Ignore non-element nodes
	if (el.nodeType !== 1) {
		return undefined;
	}

	// Handle <br /> as a new paragraph or inline break
	if (el.nodeName === 'BR') {
		// Treat a <br /> as a new empty paragraph
		return jsx('element', { type: 'paragraph' }, [{ text: '' }]);
	}

	// Handle <p> tags (paragraphs)
	if (el.nodeName === 'P') {
		const children = Array.from(el.childNodes).map(deserialize).flat();
		// Ensure empty paragraphs are restored as `{ type: 'paragraph', children: [{ text: '' }] }`
		const descendants = children.length ? children : [{ text: '' }];
		return jsx('element', { type: 'paragraph' }, descendants);
	}

	// Handle merge tags, spans, and links
	const { nodeName } = el;
	let children = Array.from(el.childNodes).map(deserialize).flat();

	if (ELEMENT_TAGS[nodeName]) {
		// Apply the corresponding element attributes
		const attrs = ELEMENT_TAGS[nodeName](el);
		return jsx('element', { ...attrs }, children.length ? children : [{ text: '' }]);
	}

	if (TEXT_TAGS[nodeName]) {
		// Apply inline text formatting (e.g., bold, italic)
		const attrs = TEXT_TAGS[nodeName](el);
		return children.map((child: Descendant): void | Text => {
			// This condition prevents issues with merge tags inside formatted text
			if (child?.type !== 'mergeTag') {
				return jsx('text', { ...attrs }, child);
			}
		});
	}

	// Default fallback to children
	return children;
};

export default deserializeHTML;

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

const EMPTY_DOCUMENT: SlateNode[] = [
	{
		type: 'paragraph',
		children: [{ text: '' }],
	},
];

const deserializeHTML = (htmlString: string): SlateNode[] => {
	try {
		if (!htmlString || typeof htmlString !== 'string') {
			return EMPTY_DOCUMENT;
		}

		// Convert <br /> tags to specific markers before processing
		let processedHtml = htmlString.replace(/<br\s*\/?>/gi, '[[BR]]');
		processedHtml = processedHtml.trim();

		if (!processedHtml) {
			return EMPTY_DOCUMENT;
		}

		if (!processedHtml.startsWith('<p>')) {
			processedHtml = `<p>${processedHtml}</p>`;
		}

		const parsed = new DOMParser().parseFromString(
			formatBeforeDeserializing(processedHtml),
			'text/html'
		).body;

		const deserialized = deserialize(parsed);
		const validNodes = ensureValidNodes(deserialized);
		const normalized = normalize(validNodes) as SlateNode[];

		return normalized.length ? normalized : EMPTY_DOCUMENT;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn('Rich text deserialization failed, using fallback.', error);
		return EMPTY_DOCUMENT;
	}
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
	const editor = createEditor();
	editor.children = val;

	try {
		Editor.normalize(editor, { force: true });
		return editor.children;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.warn('Rich text normalization failed, using fallback.', error);
		return EMPTY_DOCUMENT;
	}
};

const deserialize = (el: HTMLElement | ChildNode) => {
	const TEXT_TAGS = {
		EM: () => ({ italic: true }),
		I: () => ({ italic: true }),
		STRONG: () => ({ bold: true }),
		B: () => ({ bold: true }),
		SPAN: () => {
			const style = (el as HTMLElement).getAttribute('style');
			const colorMatch = style?.match(/color:\s*([^;]+);?/);
			const textColor = colorMatch ? colorMatch[1].trim() : undefined;
			return textColor ? { textColor } : {};
		},
	};
	const ELEMENT_TAGS = {
		P: () => ({ type: 'paragraph' }),
		MERGETAG: () => ({
			type: 'mergeTag',
			data: {
				type: ((el as HTMLElement).dataset as MergeTag).type,
				modifier: ((el as HTMLElement).dataset as MergeTag).modifier,
			},
			children: [{ text: '', bold: false, italic: false, underline: false }],
		}),
		A: () => ({
			type: 'link',
			url: (el as HTMLElement).getAttribute('href'),
		}),
	};

	// Handle plain text nodes
	if (el.nodeType === Node.TEXT_NODE) {
		const text = el.textContent || '';
		if (!text) return undefined;

		// Convert our markers back to newlines
		if (text.includes('[[BR]]')) {
			const parts = text.split('[[BR]]');
			return parts.reduce((acc, part, index) => {
				if (index === 0) return [{ text: part }];
				return [...acc, { text: '\n' }, { text: part }];
			}, []);
		}

		return { text };
	}

	// Handle paragraphs
	if (el.nodeName === 'P') {
		const children = Array.from(el.childNodes)
			.map(deserialize)
			.flat()
			.filter(Boolean)
			.map(child => {
				if (typeof child === 'string') {
					return { text: child };
				}
				return child;
			});

		return {
			type: 'paragraph',
			children: children.length ? children : [{ text: '' }]
		};
	}

	// Handle other elements
	const { nodeName } = el;
	let children = Array.from(el.childNodes)
		.map(deserialize)
		.flat()
		.filter(Boolean);

	if (ELEMENT_TAGS[nodeName]) {
		const attrs = ELEMENT_TAGS[nodeName](el);
		return jsx('element', { ...attrs }, children.length ? children : [{ text: '' }]);
	}

	if (TEXT_TAGS[nodeName]) {
		const attrs = TEXT_TAGS[nodeName](el);
		const formattedChildren = children
			.map((child: Descendant): Descendant | Descendant[] | undefined => {
				if (child?.type === 'mergeTag' || child?.type === 'link') {
					return child;
				}
				if (typeof child === 'string') {
					return jsx('text', attrs, child);
				}
				return { ...child, ...attrs };
			})
			.flat()
			.filter(Boolean);

		return formattedChildren.length ? formattedChildren : undefined;
	}

	return children;
};


export default deserializeHTML;

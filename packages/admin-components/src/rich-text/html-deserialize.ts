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
	//console.log('Initial HTML string:', JSON.stringify(htmlString));

	// Convert <br /> tags to specific markers before processing
	let processedHtml = htmlString.replace(/<br\s*\/?>/gi, '[[BR]]');
	processedHtml = processedHtml.trim();
	//console.log('After trim:', JSON.stringify(processedHtml));

	if (!processedHtml.startsWith('<p>')) {
		processedHtml = `<p>${processedHtml}</p>`;
	}
	//console.log('After p wrap:', JSON.stringify(processedHtml));

	const parsed = new DOMParser().parseFromString(
		formatBeforeDeserializing(processedHtml),
		'text/html'
	).body;
	//console.log('After parsing:', parsed.innerHTML);

	const deserialized = deserialize(parsed);
	//console.log('After deserialize:', JSON.stringify(deserialized));

	const validNodes = ensureValidNodes(deserialized);
	//console.log('After ensure valid:', JSON.stringify(validNodes));

	const normalized = normalize(validNodes) as SlateNode[];
	//console.log('Final result:', JSON.stringify(normalized));

	return normalized;
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
	////console.log('before normalizing')
	Editor.normalize(editor, { force: true });
	////console.log('after normalizing')
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
			children: [{ text: '', bold: false, italic: false, underline: false }],
		}),
		SPAN: () => {
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
		return children.map((child: Descendant): void | Text => {
			if (child?.type !== 'mergeTag') {
				if (typeof child === 'string') {
					return jsx('text', attrs, child);
				}
				return { ...child, ...attrs };
			}
		});
	}

	return children;
};


export default deserializeHTML;

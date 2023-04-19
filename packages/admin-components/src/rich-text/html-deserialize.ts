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

const deserializeHTML = ( htmlString: string ): SlateNode[] => {
	return normalize(
		deserialize(
			new DOMParser().parseFromString(
				formatBeforeDeserializing( autop( htmlString ) ),
				'text/html'
			).body
		)
	);
};

// Normalize to fix invalid JSON that may result from deserializing
// This custom normalizer should be called one time only after the component mounting
const normalize = ( val: SlateNode[] ): SlateNode[] => {
	// Create temp editor for normalizing
	const editor = createEditor();
	editor.children = val;
	Editor.normalize( editor, { force: true } );
	return editor.children;
};

const formatBeforeDeserializing = ( value: string ): string => {
	if ( ! value ) {
		return '<p></p>';
	}
	const $value = value.replace(
		/{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g,
		"<mergetag data-type='$1' data-modifier='$2'>_____</mergetag>"
	);
	return $value;
};

const deserialize = ( el: HTMLElement | ChildNode ) => {
	const TEXT_TAGS = {
		// CODE: () => ({ code: true }),
		// DEL: () => ({ strikethrough: true }),
		EM: () => ( { italic: true } ),
		I: () => ( { italic: true } ),
		// S: () => ({ strikethrough: true }),
		STRONG: () => ( { bold: true } ),
	};
	const ELEMENT_TAGS = {
		P: () => ( { type: 'paragraph' } ),
		MERGETAG: () => ( {
			type: 'mergeTag',
			data: {
				type: ( ( el as HTMLElement ).dataset as MergeTag ).type,
				modifier: ( ( el as HTMLElement ).dataset as MergeTag )
					.modifier,
			},
			children: [
				{
					text: '',
					bold: false,
					italic: false,
					underline: false,
				},
			],
		} ),
		A: () => ( {
			type: 'link',
			url: ( el as HTMLElement ).getAttribute( 'href' ),
		} ),

		// H1: () => ({ type: "heading-one" }),
		// H2: () => ({ type: "heading-two" }),
		// BLOCKQUOTE: () => ({ type: "quote" }),
		// LI: () => ({ type: "list-item" }),
		// OL: () => ({ type: "numbered-list" }),
		// UL: () => ({ type: "bulleted-list" }),
		// IMG: el => ({ type: "image", url: el.getAttribute("src") })
	};

	if ( el.nodeType === Node.TEXT_NODE ) {
		if ( el.textContent !== '\n' ) {
			return el.textContent;
		}
	}
	if ( el.nodeType !== 1 ) {
		return undefined;
	}
	if ( el.nodeName === 'BR' ) {
		return '\n';
	}

	const { nodeName } = el;
	let parent = el;

	// if (
	// 	nodeName === 'PRE' &&
	// 	el.childNodes[ 0 ] &&
	// 	el.childNodes[ 0 ].nodeName === 'CODE'
	// ) {
	// 	[ parent ] = el.childNodes;
	// }

	const children = Array.from( parent.childNodes ).map( deserialize ).flat();

	let descendants = children as Descendant[];
	if ( ! descendants.length ) {
		descendants = [ { text: '' } ];
	}

	if ( el.nodeName === 'BODY' ) {
		return jsx( 'fragment', descendants );
	}

	if ( ELEMENT_TAGS[ nodeName ] ) {
		const attrs = ELEMENT_TAGS[ nodeName ]( el );

		return jsx( 'element', { ...attrs }, descendants );
	}

	if ( TEXT_TAGS[ nodeName ] ) {
		const attrs = TEXT_TAGS[ nodeName ]( el );
		return children.map( ( child: Descendant ): void | Text => {
			// This condition is to prevent throwing error when we have a string like this: <strong> {{type:modifier}} </strong>
			if ( child.type !== 'mergeTag' ) {
				return jsx( 'text', { ...attrs }, child );
			}
		} );
	}

	return children;
};

export default deserializeHTML;

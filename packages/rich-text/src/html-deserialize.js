/**
 * External Dependencies
 */
import { jsx } from 'slate-hyperscript';
import { Editor } from 'slate';

/**
 * Internal Dependencies
 */
import createEditor from './create-editor';

const deserializeHTML = ( htmlString ) => {
	return normalize(
		deserialize(
			new DOMParser().parseFromString(
				formatBeforeDeserializing( htmlString ),
				'text/html'
			).body
		)
	);
};

// Normalize to fix invalid JSON that may result from deserializing
// This custom normalizer should be called one time only after the component mounting
const normalize = ( val ) => {
	// Create temp editor for normalizing
	const editor = createEditor( {
		withReact: true,
		withLinks: true,
		withVariables: true,
	} );
	editor.children = val;
	Editor.normalize( editor, { force: true } );
	return editor.children;
};

const formatBeforeDeserializing = ( value ) => {
	const $value = value.replace(
		/{{([a-zA-Z0-9]+):([a-zA-Z0-9-_]+)}}/g,
		"<variable data-type='$1' data-ref='$2'>_____</variable>"
	);
	return $value;
};

const deserialize = ( el ) => {
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
		VARIABLE: () => ( {
			type: 'variable',
			data: {
				ref: el.dataset.ref,
				varType: el.dataset.type,
			},
		} ),
		A: () => ( { type: 'link', url: el.getAttribute( 'href' ) } ),

		// H1: () => ({ type: "heading-one" }),
		// H2: () => ({ type: "heading-two" }),
		// BLOCKQUOTE: () => ({ type: "quote" }),
		// LI: () => ({ type: "list-item" }),
		// OL: () => ({ type: "numbered-list" }),
		// UL: () => ({ type: "bulleted-list" }),
		// IMG: el => ({ type: "image", url: el.getAttribute("src") })
	};

	if ( el.nodeType === 3 ) {
		return el.textContent === '\n' ? null : el.textContent;
	}
	if ( el.nodeType !== 1 ) {
		return null;
	}
	if ( el.nodeName === 'BR' ) {
		return '\n';
	}

	const { nodeName } = el;
	let parent = el;

	if (
		nodeName === 'PRE' &&
		el.childNodes[ 0 ] &&
		el.childNodes[ 0 ].nodeName === 'CODE'
	) {
		[ parent ] = el.childNodes;
	}

	const children = Array.from( parent.childNodes )
		.map( deserialize )
		.flat();

	let descendants = children;
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
		return children.map( ( child ) => jsx( 'text', { ...attrs }, child ) );
	}

	return children;
};

export default deserializeHTML;

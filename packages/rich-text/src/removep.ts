/**
 * Replaces `<p>` tags with two line breaks. "Opposite" of autop().
 *
 * Replaces `<p>` tags with two line breaks except where the `<p>` has attributes.
 * Unifies whitespace. Indents `<li>`, `<dt>` and `<dd>` for better readability.
 *
 * @param {string} html The content from the editor.
 *
 * @example
 * ```js
 * import { removep } from '@wordpress/autop';
 * removep( '<p>my text</p>' ); // "my text"
 * ```
 *
 * @return {string} The content with stripped paragraph tags.
 */
export function removep( html: any ) {
	const blocklist =
		'blockquote|ul|ol|li|dl|dt|dd|table|thead|tbody|tfoot|tr|th|td|h[1-6]|fieldset|figure';
	const blocklist1 = blocklist + '|div|p';
	const blocklist2 = blocklist + '|pre';
	/** @type {string[]} */
	const preserve = [];
	let preserveLinebreaks = true;
	let preserveBr = true;

	if ( ! html ) {
		return '';
	}

	// Protect script and style tags.
	if ( html.indexOf( '<script' ) !== -1 || html.indexOf( '<style' ) !== -1 ) {
		html = html.replace(
			/<(script|style)[^>]*>[\s\S]*?<\/\1>/g,
			( match ) => {
				// @ts-expect-error
				preserve.push( match );
				return '<wp-preserve>';
			}
		);
	}

	// Protect pre tags.
	if ( html.indexOf( '<pre' ) !== -1 ) {
		preserveLinebreaks = true;
		html = html.replace( /<pre[^>]*>[\s\S]+?<\/pre>/g, ( a ) => {
			a = a.replace( /<br ?\/?>(\r\n|\n)?/g, '<wp-line-break>' );
			a = a.replace( /<\/?p( [^>]*)?>(\r\n|\n)?/g, '<wp-line-break>' );
			return a.replace( /\r?\n/g, '<wp-line-break>' );
		} );
	}

	// Remove line breaks but keep <br> tags inside image captions.
	if ( html.indexOf( '[caption' ) !== -1 ) {
		preserveBr = true;
		html = html.replace( /\[caption[\s\S]+?\[\/caption\]/g, ( a ) => {
			return a
				.replace( /<br([^>]*)>/g, '<wp-temp-br$1>' )
				.replace( /[\r\n\t]+/, '' );
		} );
	}

	// Normalize white space characters before and after block tags.
	// html = html.replace(
	// 	new RegExp( '\\s*</(' + blocklist1 + ')>\\s*', 'g' ),
	// 	'</$1>\n'
	// );
	// html = html.replace(
	// 	new RegExp( '\\s*<((?:' + blocklist1 + ')(?: [^>]*)?)>', 'g' ),
	// 	'\n<$1>'
	// );

	// Mark </p> if it has any attributes.
	html = html.replace( /(<p [^>]+>[\s\S]*?)<\/p>/g, '$1</p#>' );

	// Preserve the first <p> inside a <div>.
	html = html.replace( /<div( [^>]*)?>\s*<p>/gi, '<div$1>\n\n' );

	// Remove paragraph tags.
	html = html.replace( /\s*<p>/gi, '' );
	html = html.replace( /\s*<\/p>\s*/gi, '\n\n' );

	// Normalize white space chars and remove multiple line breaks.
	// html = html.replace( /\n[\s\u00a0]+\n/g, '\n\n' );

	// Replace <br> tags with line breaks.
	html = html.replace( /(\s*)<br ?\/?>\s*/gi, ( _, space ) => {
		if ( space && space.indexOf( '\n' ) !== -1 ) {
			return '\n\n';
		}

		return '\n';
	} );

	// Fix line breaks around <div>.
	html = html.replace( /\s*<div/g, '\n<div' );
	html = html.replace( /<\/div>\s*/g, '</div>\n' );

	// Fix line breaks around caption shortcodes.
	html = html.replace(
		/\s*\[caption([^\[]+)\[\/caption\]\s*/gi,
		'\n\n[caption$1[/caption]\n\n'
	);
	html = html.replace( /caption\]\n\n+\[caption/g, 'caption]\n\n[caption' );

	// Pad block elements tags with a line break.
	html = html.replace(
		new RegExp( '\\s*<((?:' + blocklist2 + ')(?: [^>]*)?)\\s*>', 'g' ),
		'\n<$1>'
	);
	html = html.replace(
		new RegExp( '\\s*</(' + blocklist2 + ')>\\s*', 'g' ),
		'</$1>\n'
	);

	// Indent <li>, <dt> and <dd> tags.
	html = html.replace( /<((li|dt|dd)[^>]*)>/g, ' \t<$1>' );

	// Fix line breaks around <select> and <option>.
	if ( html.indexOf( '<option' ) !== -1 ) {
		html = html.replace( /\s*<option/g, '\n<option' );
		html = html.replace( /\s*<\/select>/g, '\n</select>' );
	}

	// Pad <hr> with two line breaks.
	if ( html.indexOf( '<hr' ) !== -1 ) {
		html = html.replace( /\s*<hr( [^>]*)?>\s*/g, '\n\n<hr$1>\n\n' );
	}

	// Remove line breaks in <object> tags.
	if ( html.indexOf( '<object' ) !== -1 ) {
		html = html.replace( /<object[\s\S]+?<\/object>/g, ( a ) => {
			return a.replace( /[\r\n]+/g, '' );
		} );
	}

	// Unmark special paragraph closing tags.
	html = html.replace( /<\/p#>/g, '</p>\n' );

	// Pad remaining <p> tags whit a line break.
	html = html.replace( /\s*(<p [^>]+>[\s\S]*?<\/p>)/g, '\n$1' );

	// Trim.
	html = html.replace( /^\s+/, '' );
	html = html.replace( /[\s\u00a0]+$/, '' );

	if ( preserveLinebreaks ) {
		html = html.replace( /<wp-line-break>/g, '\n' );
	}

	if ( preserveBr ) {
		html = html.replace( /<wp-temp-br([^>]*)>/g, '<br$1>' );
	}

	// Restore preserved tags.
	if ( preserve.length ) {
		html = html.replace( /<wp-preserve>/g, () => {
			return /** @type {string} */ preserve.shift();
		} );
	}

	return html;
}


/**
 * External Dependencies
 */
import { ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote';
import { ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6 } from '@udecode/plate-heading';
import { ELEMENT_LINK } from '@udecode/plate-link';
import { ELEMENT_LI, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list';
import { ELEMENT_IMAGE } from '@udecode/plate-media';
import { ELEMENT_MENTION } from '@udecode/plate-mention';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { ELEMENT_TABLE, ELEMENT_TD, ELEMENT_TR } from '@udecode/plate-table';
import escapeHtml from 'escape-html';
import { Text, Node } from 'slate';
let attributes;
const getNode = ({ element, children }) => {
    switch (element.type) {
      case ELEMENT_BLOCKQUOTE:
        // the plugin may have an optional parameter for the wrapping tag, default to blockquote
        return `<blockquote>${children}</blockquote>`;
      case ELEMENT_PARAGRAPH:
        return `<p ${attributes}>${children}</p>`;
      case ELEMENT_LINK:
        return `<a style="${attributes}" href="${escapeHtml(element.url)}">${children}</a>`;
      case ELEMENT_MENTION: {
        return element.value;
      }
      case ELEMENT_H1:
        return `<h1 style="${attributes}">${children}</h1>`;
      case ELEMENT_H2:
        return `<h2 style="${attributes}">${children}</h2>`;
      case ELEMENT_H3:
        return `<h3 style="${attributes}">${children}</h3>`;
      case ELEMENT_H4:
        return `<h4 style="${attributes}">${children}</h4>`;
      case ELEMENT_H5:
        return `<h5 style="${attributes}">${children}</h5>`;
      case ELEMENT_H6:
        return `<h6 style="${attributes}">${children}</h6>`;
      case ELEMENT_OL:
        return `<ol>${children}</ol>`;
      case ELEMENT_UL:
        return `<ul>${children}</ul>`;
      case ELEMENT_LI:
        return `<li>${children}</li>`;
      case ELEMENT_TABLE:
        return `<table>${children}</table>`;
      case ELEMENT_TR:
        return `<tr>${children}</tr>`;
      case ELEMENT_TD:
        return `<td>${children}</td>`;
      case ELEMENT_IMAGE:
        return `<img src="${escapeHtml(element.url)}">${children}</img>`;
      default:
        return children;
    }
  };
  
  const getLeaf = ({ leaf, children }) => {
    console.log(leaf);
    let newChildren = children;
    if (leaf['bold']) {
      newChildren = `<strong>${newChildren}</strong>`;
    }
    if (leaf['italic']) {
      newChildren = `<i>${newChildren}</i>`;
    }
    if (leaf['underline']) {
      newChildren = `<u>${newChildren}</u>`;
    }
    if(leaf['color']) {
        attributes += 'color: ' + leaf['color'] + ';';
    }
    if(leaf['subscript']) {
      newChildren = `<sub>${newChildren}</sub>`;
    }
    if(leaf['superscript']) {
      newChildren = `<sup>${newChildren}</sup>`;
    }
    if(leaf['strikethrough']) {
      newChildren = `<del>${newChildren}</del>`;
    }
    if(leaf['align']) {
      attributes += 'text-align: ' + leaf['align'] + ';';
    }
    if(leaf['lineHeight'])  {
      attributes += 'line-height: ' + leaf['lineHeight'] + ';';
    }
  
    if(leaf['backgroundColor']) {
      attributes += 'background-color: ' + leaf['backgroundColor'] + ';';
    }
    return newChildren;
  };
  
  // should iterate over the plugins, see htmlDeserialize
  export const htmlSerialize = (nodes) =>
    nodes
      .map((node) => {
        attributes = '';
        console.log(node)
        if (Text.isText(node)) {
          return getLeaf({ leaf: node, children: node.text });
        }
        return getNode({ element: node, children: htmlSerialize(node.children) });
      })
      .join("");
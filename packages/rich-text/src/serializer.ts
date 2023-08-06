
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
import { size } from 'lodash';
import { Text, Node } from 'slate';
let attributes;
let leafAttributes;
const getNode = ({ element, children }) => {
    if(size(leafAttributes) > 0) {  
      children = `<span style="${leafAttributes}">${children}</span>`;
    }   
    if(element['align']) {
      attributes = `text-align:${element['align']};`;
    }
    if(element['lineHeight']) {
      attributes = `${attributes}line-height:${element['lineHeight']};`;
    }

    switch (element.type) {
      case ELEMENT_BLOCKQUOTE:
        // the plugin may have an optional parameter for the wrapping tag, default to blockquote
        return `<blockquote>${children}</blockquote>`;
      case ELEMENT_PARAGRAPH:
        return `<p style="${attributes}">${children}</p>`;
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
        return `<li style="${attributes}">${children}</li>`;
      case ELEMENT_TABLE:
        return `<table>${children}</table>`;
      case ELEMENT_TR:
        return `<tr>${children}</tr>`;
      case ELEMENT_TD:
        return `<td>${children}</td>`;
      case ELEMENT_IMAGE:
        return `<img style="${attributes}" src="${escapeHtml(element.url)}">${children}</img>`;
      default:
        return children;
    }
  };
  
  const getLeaf = ({ leaf, children }) => {
    leafAttributes = '';

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
      leafAttributes += "color: " + leaf['color'] + ";";
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
      leafAttributes += 'background-color: ' + leaf['backgroundColor'] + ';';
    }
    return newChildren;
  };
  
  // should iterate over the plugins, see htmlDeserialize
  export const htmlSerialize = (nodes, index) =>
    nodes
      .map((node) => {
        attributes = '';
       
        // if(node['listStyleType'] === 'disc' && !node['listStart']) {
        //   ulist = true;
        // }
        // if(node['listStyleType'] === 'decimal' && !node['listStart']) {
        //   olist = true;
        // }
        // if (!node['listStyleType'] && ulist) {
        //   ulist = false;
        //   return `</ul>`;
        // }
        // if (!node['listStyleType'] && olist) {
        //   olist = false;
        //   return `</ol>`;
        // }
        // if(ulist && !ulistStart) {
        //   ulistStart = true;
        //   return `<ul>`;
        // }      
        // if(olist && !olistStart) {
        //   olistStart = true;
        //   return `<ol>`;
        // }

        if (Text.isText(node)) {
          return getLeaf({ leaf: node, children: node.text });
        }
        return getNode({ element: node, children: htmlSerialize(node.children) });
      })
      .join("");

/**
 * External Dependencies
 */
import escapeHtml from 'escape-html';
import { Text, Node } from 'slate';

const getNode = ({ element, children }) => {
    console.log(children)
    console.log(element.type);
    switch (element.type) {
      case 'blockquote':
        // the plugin may have an optional parameter for the wrapping tag, default to blockquote
        return `<blockquote>${children}</blockquote>`;
      case 'p':
        return `<p>${children}</p>`;
      case 'link':
        return `<a href="${escapeHtml(element.url)}">${children}</a>`;
      case 'h1':
        return `<h1>${children}</h1>`;
      case 'h2':
        return `<h2>${children}</h2>`;
      case 'ol':
        return `<ol>${children}</ol>`;
      case 'ul':
        return `<ul>${children}</ul>`;
      case 'li':
        return `<li>${children}</li>`;
      case 'table':
        return `<table>${children}</table>`;
      case 'tr':
        return `<tr>${children}</tr>`;
      case 'td':
        return `<td>${children}</td>`;
      case 'img':
        return `<img src="${escapeHtml(element.url)}">${children}</img>`;
      default:
        return children;
    }
  };
  
  const getLeaf = ({ leaf, children }) => {
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
    // if(leaf['color']) {
    //     newChildren=
    // }
    return newChildren;
  };
  
  // should iterate over the plugins, see htmlDeserialize
  export const htmlSerialize = (nodes) =>
    nodes
      .map((node) => {
        if (Text.isText(node)) {
          return getLeaf({ leaf: node, children: node.text });
        }
        return getNode({ element: node, children: htmlSerialize(node.children) });
      })
      .join("");
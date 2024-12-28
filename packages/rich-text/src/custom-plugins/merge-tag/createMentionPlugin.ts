import { createPluginFactory } from '@udecode/plate-common';

import { mentionOnKeyDownHandler } from './handlers/mentionOnKeyDownHandler';
import { isSelectionInMentionInput } from './queries/index';
import { MentionPlugin } from './types';
import { withMention } from './withMention';

export const ELEMENT_MENTION = 'mention';
export const ELEMENT_MENTION_INPUT = 'mention_input';

import { size } from 'lodash';
/**
 * Enables support for autocompleting @mentions.
 */
export const createMentionPlugin = createPluginFactory<MentionPlugin>({
  key: ELEMENT_MENTION,
  isElement: true,
  isInline: true,
  isVoid: true,
  handlers: {
    onKeyDown: mentionOnKeyDownHandler({ query: isSelectionInMentionInput }),
  },
  withOverrides: withMention,
  options: {
    trigger: '@',
    triggerPreviousCharPattern: /.*/,
    createMentionNode: (item) => ({ value: `{{${item.type}:${item.value}}}`, mentionType: item.type, mentionModifier: item.value }),
  },
  deserializeHtml: {

    getNode: (el, node) => {
      // //console.log(el);
      // let styles = {};
      // if(el?.style?.lineHeight) {
      //   styles = { ...styles, lineHeight: el.style.lineHeight };
      // }
      // if(el?.style?.textAlign) {
      //   styles = { ...styles, align: el.style.textAlign };
      // }
      // if(el?.style?.color) {
      //   styles = { ...styles, color: el.style.color };
      // }
      // if(el?.style.backgroundColor) {
      //   styles = { ...styles, backgroundColor: el.style.backgroundColor };
      // }
      // if(size(styles) > 0 ) {
      //   return {
      //     type: el.nodeName.toLowerCase(),
      //     ...styles,
      //     children: [{ text: el.textContent }]
      //   }
      // }
      if (el.nodeName === 'MENTION') {
        return {
          type: 'mention',
          value: `{{${el.dataset.type}:${el.dataset.modifier}}}`,
          mentionType: el.dataset.type,
          mentionModifier: el.dataset.modifier,
          children: [{ text: "" }]
        }
      }
    }
  },
  plugins: [
    {
      key: ELEMENT_MENTION_INPUT,
      isElement: true,
      isInline: true,
    },
  ],
  then: (editor, { key }) => ({
    options: {
      id: key,
    },
  }),
});

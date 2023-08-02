import React, { useState } from 'react';
import { editableProps } from '../../../lib/plate/demo/editableProps';
import { plateUI } from '../../../lib/plate/demo/plateUI';
import { basicNodesPlugins } from '../../../lib/plate/demo/plugins/basicNodesPlugins';
import { iframeValue } from '../../../lib/plate/demo/values/iframeValue';
import { Plate } from '@udecode/plate-common';
import { createPortal } from 'react-dom';

import { createMyPlugins, MyValue } from '../../../libtypes/plate-types';

import {
  createEditableVoidPlugin,
  EditableVoidElement,
} from './editable-voids-demo';

const plugins = createMyPlugins(
  [
    ...basicNodesPlugins,
    createEditableVoidPlugin({
      component: EditableVoidElement,
    }),
  ],
  {
    components: plateUI,
  }
);

export function IFrame({ children, ...props }: any) {
  const [contentRef, setContentRef] = useState<any>(null);
  const mountNode =
    contentRef &&
    contentRef.contentWindow &&
    contentRef.contentWindow.document.body;

  return (
    // eslint-disable-next-line jsx-a11y/iframe-has-title
    <iframe {...props} ref={setContentRef}>
      {mountNode && createPortal(React.Children.only(children), mountNode)}
    </iframe>
  );
}

export default function IframeDemo() {
  return (
    <IFrame>
      <Plate<MyValue>
        editableProps={editableProps}
        plugins={plugins}
        initialValue={iframeValue}
      />
    </IFrame>
  );
}

'use client';

import React, { useRef, useMemo } from 'react';
import { useFields } from '@quillforms/admin-components';
import { CommentsProvider } from '@udecode/plate-comments';
import { Plate, PlateProvider } from '@udecode/plate-common';
import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { commentsUsers, myUserId } from '../../lib/plate/comments';
import { MENTIONABLES } from '../../lib/plate/mentionables';
import { plugins } from '../../lib/plate/plate-plugins';
import { cn } from '../../lib/utils';
import { CommentsPopover } from '../../components/plate-ui/comments-popover';
import { CursorOverlay } from '../../components/plate-ui/cursor-overlay';
import { FixedToolbar } from '../../components/plate-ui/fixed-toolbar';
import { FixedToolbarButtons } from '../../components/plate-ui/fixed-toolbar-buttons';
import { FloatingToolbar } from '../../components/plate-ui/floating-toolbar';
import { FloatingToolbarButtons } from '../../components/plate-ui/floating-toolbar-buttons';
import { MentionCombobox } from '../../components/plate-ui/mention-combobox';
import { usePlateEditorState, usePlateSelectors, createPlateEditor, deserializeHtml } from "@udecode/plate-core";
import { serializeHtml } from '@udecode/plate-serializer-html';
import { htmlSerialize } from '../../serializer';

const SerializeHtml = () => {
  const editor = usePlateEditorState();
  const html = serializeHtml(editor, {
    nodes: editor.children,
  });
  console.log(html)

  return <pre>{html}</pre>;
};

export default function Editor() {
  const containerRef = useRef(null);

  // const initialValue = [
  //   {
  //     type: ELEMENT_PARAGRAPH,
  //     children: [{ text: 'Hello, World!' }],
  //   },
  // ];

  const initialValue = useMemo(() => {
    const value = "<p >Hello, World!{{field:oy1apvc1n}}</p>";
    const $value = value.replace(
      /{{([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]+)}}/g,
      "<mention data-type='$1' data-modifier='$2'>_____</mention>"
    );
    const tmpEditor = createPlateEditor({ plugins });
    return deserializeHtml(tmpEditor, {
      element: $value
    });
  }
    , []
  );
  const fields = useFields({ section: 'fields' });
  let items = fields;
  items = items.map((item, index) => {
    return {
      ...item,
      text: item.label,
      key: `${index}`
    }
  })
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="relative">
        <PlateProvider plugins={plugins} initialValue={initialValue}
          onChange={(newValue) => {
            console.log("#########");
            console.log(htmlSerialize(newValue));
            console.log("##########")
          }}
        >
          <FixedToolbar>
            <FixedToolbarButtons />
          </FixedToolbar>

          <div className="flex">
            {/* <CommentsProvider users={commentsUsers} myUserId={myUserId}> */}
            <div
              ref={containerRef}
              className={cn(
                'relative flex max-w-[900px] overflow-x-auto',
                '[&_.slate-start-area-top]:!h-4',
                '[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px]'
              )}
            >
              <Plate
                editableProps={{
                  autoFocus: true,
                  className: cn(
                    'relative max-w-full leading-[1.4] outline-none [&_strong]:font-bold',
                    '!min-h-[600px] w-[900px] px-[96px] py-16'
                  ),
                  placeholder: 'Type…',
                }}
              >
                {/* <FloatingToolbar>
                  <FloatingToolbarButtons />
                </FloatingToolbar> */}

                <MentionCombobox items={items} />

                <CursorOverlay containerRef={containerRef} />
                {/* <SerializeHtml /> */}
              </Plate>
            </div>

            {/* <CommentsPopover />
          </CommentsProvider> */}
          </div>
        </PlateProvider>
      </div >
    </DndProvider >
  );
}

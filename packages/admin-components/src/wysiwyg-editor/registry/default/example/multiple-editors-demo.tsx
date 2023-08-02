import React from 'react';
import { basicNodesPlugins } from '../../../lib/plate/demo/plugins/basicNodesPlugins';
import { imagePlugins } from '../../../lib/plate/demo/plugins/imagePlugins';
import { basicElementsValue } from '../../../lib/plate/demo/values/basicElementsValue';
import { basicMarksValue } from '../../../lib/plate/demo/values/basicMarksValue';
import { imageValue } from '../../../lib/plate/demo/values/mediaValue';
import { Plate, PlateProps, PlateProvider } from '@udecode/plate-common';

import { MyValue } from '../../../libtypes/plate-types';
import { PlaygroundTurnIntoDropdownMenu } from '../../../libcomponents/plate-ui/playground-turn-into-dropdown-menu';
import { FixedToolbar } from '../../../libregistry/default/plate-ui/fixed-toolbar';
import { Separator } from '../../../libregistry/default/plate-ui/separator';

function Editor(props: PlateProps<MyValue>) {
  return <Plate {...props}>{/* <MarkFloatingToolbar /> */}</Plate>;
}

export default function MultipleEditorsDemo() {
  return (
    <PlateProvider<MyValue>
      plugins={basicNodesPlugins}
      initialValue={basicElementsValue}
    >
      <PlateProvider<MyValue>
        id="marks"
        plugins={basicNodesPlugins}
        initialValue={basicMarksValue}
      >
        <PlateProvider<MyValue>
          id="image"
          plugins={imagePlugins}
          initialValue={imageValue}
        >
          <FixedToolbar>
            <PlaygroundTurnIntoDropdownMenu />
          </FixedToolbar>

          <div>
            <Editor />
            <Separator />
            <Editor id="marks" />
            <Separator />
            <Editor id="image" />
          </div>
        </PlateProvider>
      </PlateProvider>
    </PlateProvider>
  );
}

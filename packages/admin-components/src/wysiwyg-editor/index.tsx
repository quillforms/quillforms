
import React, { useEffect, useMemo, useRef, useState, useReducer } from 'react';
import { createPlateUI } from './lib/plate/create-plate-ui';
import { CommentsProvider } from './lib/plate/demo/comments/CommentsProvider';
import { editableProps } from './lib/plate/demo/editableProps';
import { isEnabled } from './lib/plate/demo/is-enabled';
import { alignPlugin } from './lib/plate/demo/plugins/alignPlugin';
import { autoformatIndentLists } from './lib/plate/demo/plugins/autoformatIndentLists';
import { autoformatLists } from './lib/plate/demo/plugins/autoformatLists';
import { autoformatRules } from './lib/plate/demo/plugins/autoformatRules';
import { dragOverCursorPlugin } from './lib/plate/demo/plugins/dragOverCursorPlugin';
import { emojiPlugin } from './lib/plate/demo/plugins/emojiPlugin';
import { exitBreakPlugin } from './lib/plate/demo/plugins/exitBreakPlugin';
import { forcedLayoutPlugin } from './lib/plate/demo/plugins/forcedLayoutPlugin';
import { indentPlugin } from './lib/plate/demo/plugins/indentPlugin';
import { lineHeightPlugin } from './lib/plate/demo/plugins/lineHeightPlugin';
import { linkPlugin } from './lib/plate/demo/plugins/linkPlugin';
import { resetBlockTypePlugin } from './lib/plate/demo/plugins/resetBlockTypePlugin';
import { selectOnBackspacePlugin } from './lib/plate/demo/plugins/selectOnBackspacePlugin';
import { softBreakPlugin } from './lib/plate/demo/plugins/softBreakPlugin';
import { tabbablePlugin } from './lib/plate/demo/plugins/tabbablePlugin';
import { trailingBlockPlugin } from './lib/plate/demo/plugins/trailingBlockPlugin';
import { MENTIONABLES } from './lib/plate/demo/values/mentionables';
import { createAlignPlugin } from '@udecode/plate-alignment';
import { createAutoformatPlugin } from '@udecode/plate-autoformat';
import {
    createBoldPlugin,
    createCodePlugin,
    createItalicPlugin,
    createStrikethroughPlugin,
    createSubscriptPlugin,
    createSuperscriptPlugin,
    createUnderlinePlugin,
} from '@udecode/plate-basic-marks';
import { createBlockquotePlugin } from '@udecode/plate-block-quote';
import {
    createExitBreakPlugin,
    createSingleLinePlugin,
    createSoftBreakPlugin,
} from '@udecode/plate-break';

import { createCodeBlockPlugin } from '@udecode/plate-code-block';
import { createComboboxPlugin } from '@udecode/plate-combobox';
import { createCommentsPlugin } from '@udecode/plate-comments';
import {
    createPlateEditor,
    Plate,
    PlatePluginComponent,
    PlateProvider,
    usePlateActions,
    usePlateSelectors,
    usePlateEditorState,
    deserializeHtml,
    focusEditor,
    getStartPoint,

} from '@udecode/plate-common';
import { serializeHtml } from '@udecode/plate-serializer-html';
import { createDndPlugin } from '@udecode/plate-dnd';
import { createEmojiPlugin } from '@udecode/plate-emoji';
import { createExcalidrawPlugin } from '@udecode/plate-excalidraw';
import {
    createFontBackgroundColorPlugin,
    createFontColorPlugin,
    createFontSizePlugin,
} from '@udecode/plate-font';
import { createHeadingPlugin } from '@udecode/plate-heading';
import { createHighlightPlugin } from '@udecode/plate-highlight';
import { createHorizontalRulePlugin } from '@udecode/plate-horizontal-rule';
import { createIndentPlugin } from '@udecode/plate-indent';
import { createIndentListPlugin } from '@udecode/plate-indent-list';
import { createJuicePlugin } from '@udecode/plate-juice';
import { createKbdPlugin } from '@udecode/plate-kbd';
import { createLineHeightPlugin } from '@udecode/plate-line-height';
import { createLinkPlugin } from '@udecode/plate-link';
import { createListPlugin, createTodoListPlugin } from '@udecode/plate-list';
import {
    createImagePlugin,
    createMediaEmbedPlugin,
} from '@udecode/plate-media';
import { createMentionPlugin } from '@udecode/plate-mention';
import { createNodeIdPlugin } from '@udecode/plate-node-id';
import { createNormalizeTypesPlugin } from '@udecode/plate-normalizers';
import { createParagraphPlugin } from '@udecode/plate-paragraph';
import { createResetNodePlugin } from '@udecode/plate-reset-node';
import { createSelectOnBackspacePlugin } from '@udecode/plate-select';
import { createBlockSelectionPlugin } from '@udecode/plate-selection';
import { createDeserializeDocxPlugin } from '@udecode/plate-serializer-docx';
import { createDeserializeMdPlugin } from '@udecode/plate-serializer-md';
import { createTabbablePlugin } from '@udecode/plate-tabbable';
import { createTablePlugin } from '@udecode/plate-table';
import { createTrailingBlockPlugin } from '@udecode/plate-trailing-block';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { createMyPlugins, MyValue } from './types/plate-types';
import { ValueId } from './config/setting-values';
import { cn } from './lib/utils';
import { PlaygroundFixedToolbarButtons } from './components/plate-ui/playground-fixed-toolbar-buttons';
import { PlaygroundFloatingToolbarButtons } from './components/plate-ui/playground-floating-toolbar-buttons';
import { CommentsPopover } from './registry/default/plate-ui/comments-popover';
import { CursorOverlay } from './registry/default/plate-ui/cursor-overlay';
import { FixedToolbar } from './registry/default/plate-ui/fixed-toolbar';
import { FloatingToolbar } from './registry/default/plate-ui/floating-toolbar';
import { MentionCombobox } from './registry/default/plate-ui/mention-combobox';
import { size } from "lodash"
import { htmlSerialize } from "./serializer";
export const usePlaygroundPlugins = ({
    id,
    components = createPlateUI(),
}: {
    id?: ValueId;
    components?: Record<string, PlatePluginComponent>;
} = {}) => {

    const autoformatOptions = {
        rules: [...autoformatRules],
        enableUndoOnDelete: true,
    };

    if (id === 'indentlist') {
        autoformatOptions.rules.push(...autoformatIndentLists);
    } else if (id === 'list') {
        autoformatOptions.rules.push(...autoformatLists);
    } else {
        autoformatOptions.rules.push(...autoformatIndentLists);
        autoformatOptions.rules.push(...autoformatLists);
    }

    return useMemo(
        () =>
            createMyPlugins(
                [
                    // // Nodes
                    createParagraphPlugin({ enabled: true }),
                    createHeadingPlugin({ enabled: true }),
                    createBlockquotePlugin({ enabled: true }),
                    createCodeBlockPlugin({ enabled: true }),
                    createHorizontalRulePlugin({ enabled: true }),
                    createLinkPlugin({ ...linkPlugin, enabled: true }),
                    createListPlugin({
                        enabled: true,
                    }),

                    createImagePlugin({ enabled: true }),
                    createMediaEmbedPlugin({ enabled: true }),
                    createMentionPlugin({ enabled: true }),
                    createTablePlugin({ enabled: true }),
                    createTodoListPlugin({ enabled: true }),
                    createExcalidrawPlugin({ enabled: true }),

                    // // Marks
                    createBoldPlugin({ enabled: true }),
                    createItalicPlugin({ enabled: true }),
                    createUnderlinePlugin({ enabled: true }),
                    createStrikethroughPlugin({ enabled: true }),
                    createCodePlugin({ enabled: true }),
                    createSubscriptPlugin({ enabled: true }),
                    createSuperscriptPlugin({ enabled: true }),
                    createFontColorPlugin({ enabled: true }),
                    createFontBackgroundColorPlugin({
                        enabled: true,
                    }),
                    createFontSizePlugin({ enabled: true }),
                    createHighlightPlugin({ enabled: true }),
                    createKbdPlugin({ enabled: true }),

                    // Block Style
                    createAlignPlugin({ ...alignPlugin, enabled: true }),
                    createIndentPlugin({ ...indentPlugin, enabled: true }),
                    createIndentListPlugin({
                        enabled: true,
                    }),
                    createLineHeightPlugin({
                        ...lineHeightPlugin,
                        enabled: true,
                    }),
                    // // Functionality
                    createAutoformatPlugin({
                        enabled: true,
                        options: autoformatOptions,
                    }),
                    createBlockSelectionPlugin({
                        options: {
                            sizes: {
                                top: 0,
                                bottom: 0,
                            },
                        },
                        enabled: true,
                    }),
                    createComboboxPlugin({ enabled: true }),
                    createDndPlugin({
                        options: { enableScroller: true },
                        enabled: true,
                    }),
                    createEmojiPlugin({ ...emojiPlugin, enabled: true }),
                    createExitBreakPlugin({
                        ...exitBreakPlugin,
                        enabled: true,
                    }),
                    createNodeIdPlugin({ enabled: true }),
                    createNormalizeTypesPlugin({
                        ...forcedLayoutPlugin,
                        enabled: true,
                    }),
                    createResetNodePlugin({
                        ...resetBlockTypePlugin,
                        enabled: true,
                    }),
                    createSelectOnBackspacePlugin({
                        ...selectOnBackspacePlugin,
                        enabled: true,
                    }),
                    // createSingleLinePlugin({
                    //     enabled: true,
                    // }),
                    createSoftBreakPlugin({
                        ...softBreakPlugin,
                        enabled: true,
                    }),
                    createTabbablePlugin({
                        ...tabbablePlugin,
                        enabled: true,
                    }),

                    createTrailingBlockPlugin({
                        enabled: true,
                    }),
                    createJuicePlugin(),

                    { ...dragOverCursorPlugin, enabled: true },

                ],
                {
                    components,
                }
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
};

const Serialized = () => {
    const editor = usePlateEditorState();
    const html = useMemo(() => serializeHtml(editor, {
        nodes: editor.children,
        dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,

    }), [editor.children]);

    return <div>{html} </div>;
};

// export default () => {
//     const plugins = usePlaygroundPlugins({
//         components: createPlateUI(
//             {},
//             {
//                 placeholder: true,
//                 draggable: true,
//             }
//         ),
//     });
//     return (
//         <DndProvider backend={HTML5Backend}>
//             <Plate<MyValue> editableProps={editableProps} plugins={plugins}>
//             </Plate>
//         </DndProvider>
//     );
// };


export interface ResetPluginsEffectProps {
    initialValue: any;
    plugins: any;
}

export function ResetPluginsEffect({
    initialValue,
    plugins,
}: ResetPluginsEffectProps) {
    const editor = usePlateSelectors().editor();
    const setEditor = usePlateActions().editor();
    const setValue = usePlateActions().value();

    useEffect(() => {
        const newEditor = createPlateEditor({ id: editor.id, plugins });
        newEditor.children = initialValue ?? editor.children;
        setValue(initialValue);
        setEditor(newEditor);
    }, [plugins, setEditor, editor.id, editor.children, initialValue, setValue]);

    return null;
}

export default function PlaygroundDemo({ id }: { id?: ValueId }) {
    const containerRef = useRef(null);
    const [value, setValue] = useState([]);
    const plugins = usePlaygroundPlugins({
        id,
        components: createPlateUI(
            {},
            {
                placeholder: false,
                draggable: true,
            }
        ),
    });

    // useEffect(() => {
    //     if (isRendered && editor) {
    //         setTimeout(() => {
    //             focusEditor(editor, getStartPoint(editor, [0]));
    //         }, 0);
    //     }
    // }, [editor, isRendered]);

    const initialValue = useMemo(() => {
        const tmpEditor = createPlateEditor({ plugins });
        return deserializeHtml(tmpEditor, { element: "<p>daFvfefv</p>" });
    }
        , []
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative">
                <PlateProvider<MyValue>
                    initialValue={initialValue}
                    plugins={plugins}
                    onChange={(value) => {
                        console.log(value)
                        console.log(htmlSerialize(value));
                        setValue(value);
                    }}

                //
                >
                    <ResetPluginsEffect initialValue={initialValue} plugins={plugins} />

                    <FixedToolbar>
                        <PlaygroundFixedToolbarButtons id={id} />
                    </FixedToolbar>

                    <div className="flex">
                        {/* <CommentsProvider> */}
                        <div
                            ref={containerRef}
                            className={cn(
                                'relative flex max-w-[900px] overflow-x-auto',
                                '[&_.slate-start-area-top]:!h-4',
                                '[&_.slate-start-area-left]:!w-3 [&_.slate-start-area-right]:!w-3',
                                !id &&
                                'md:[&_.slate-start-area-left]:!w-[64px] md:[&_.slate-start-area-right]:!w-[64px]'
                            )}
                        >
                            <Plate
                                editableProps={{
                                    ...editableProps,
                                    placeholder: '',
                                    className: cn(
                                        editableProps.className,
                                        'px-8 outline-none',
                                        !id &&
                                        'min-h-[920px] w-[900px] pb-[20vh] pt-4 md:px-[96px]',
                                        id && 'pb-8 pt-2'
                                    ),
                                }}
                            >
                                {/* <FloatingToolbar>
                                    <PlaygroundFloatingToolbarButtons id={id} />
                                </FloatingToolbar> */}

                                {isEnabled('mention', id) && (
                                    <MentionCombobox items={MENTIONABLES} />
                                )}

                                {isEnabled('cursoroverlay', id) && (
                                    <CursorOverlay containerRef={containerRef} />
                                )}
                                {size(value) > 0 && <Serialized />}
                            </Plate>
                        </div>

                        {/* {isEnabled('comment', id) && <CommentsPopover />}
                        </CommentsProvider> */}


                    </div>
                </PlateProvider>
            </div>
        </DndProvider>
    );
}
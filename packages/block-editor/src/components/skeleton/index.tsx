import { useEffect, useState } from "@wordpress/element";
import BlockEdit from "../block-edit";
import { Form } from "@quillforms/renderer-core";
import { useCurrentThemeId, useCurrentTheme } from '@quillforms/theme-editor';

/**
 * WordPress Dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal Dependencies
 */
import Editor from './editor';
/**
 * External Dependencies
 */
import { cloneDeep, omit, map } from 'lodash';
import { TailSpin as Loader } from 'react-loader-spinner';
import classnames from 'classnames';
import { css } from 'emotion';

const editLabel = ({ childId, childIndex, parentId }) => {
    return <Editor childId={childId} childIndex={childIndex} parentId={parentId} type="label" />;
}
const editDescription = () => {
    return <Editor type="description" />;
}
const Skeleton = () => {

    const { currentChildBlockId } = useSelect(select => {
        return {
            currentChildBlockId: select('quillForms/block-editor').getCurrentChildBlockId()
        }
    });

    //     const [readyToRender, setReadyToRender] = useState(false);

    //     useEffect(() => {
    //         setReadyToRender(false);
    //         if (currentBlockId) {
    //             setTimeout(() => {

    //                 setReadyToRender(true);
    //             }, 50);
    //         }
    //     }, [currentBlockId]);

    //     return (
    //         <div className="block-editor-block-edit__skeleton">
    //             {readyToRender && <BlockEdit id={currentBlockId} />}
    //         </div>
    //     )
    // }
    const themeId = useCurrentThemeId();
    const currentTheme = useCurrentTheme();
    const {
        hasThemesFinishedResolution,
        hasFontsFinishedResolution,
        themesList,
        customFontsList,
        currentBlockBeingEdited,
        blocks,
        messages,
        settings,
        customCSS,
    } = useSelect((select) => {
        // hasFinishedResolution isn't in select map and until now, @types/wordpress__data doesn't have it by default.
        const { hasFinishedResolution } = select('quillForms/theme-editor');
        const customFontsSelector = select('quillForms/custom-fonts');

        return {
            hasThemesFinishedResolution:
                hasFinishedResolution('getThemesList'),
            hasFontsFinishedResolution:
                // @ts-expect-error
                customFontsSelector ? customFontsSelector.hasFinishedResolution('getFontsList') : true,

            themesList: select('quillForms/theme-editor').getThemesList(),
            customFontsList: customFontsSelector?.getFontsList() ?? [],
            currentBlockBeingEdited: select(
                'quillForms/block-editor'
            ).getCurrentBlockId(),
            blocks: select('quillForms/block-editor').getBlocks(),
            messages: select('quillForms/messages-editor').getMessages(),
            settings: select('quillForms/settings-editor').getSettings(),
            customCSS: select('quillForms/code-editor').getCustomCSS(),
        };
    });

    const { goToBlock, setSwiper } = useDispatch('quillForms/renderer-core');
    const { setCurrentBlock, setCurrentChildBlock } = useDispatch('quillForms/block-editor');

    const $themesList = cloneDeep(themesList);
    if (themeId) {
        $themesList[
            $themesList.findIndex((theme) => theme.id === themeId)
        ] = {
            id: themeId,
            ...currentTheme,
        };
    }



    useEffect(() => {
        if (!hasThemesFinishedResolution) return;
        const formFields = blocks.filter(
            (block) =>
                block.name !== 'thankyou-screen' &&
                block.name !== 'welcome-screen'
        );

        const $thankyouScreens = blocks
            .filter((block) => block.name === 'thankyou-screen')
            .concat({
                id: 'default_thankyou_screen',
                name: 'thankyou-screen',
            });

        const $welcomeScreens = map(
            blocks.filter((block) => block.name === 'welcome-screen'),
            (block) => omit(block, ['name'])
        );

        const $currentPath = cloneDeep(formFields);
        setSwiper({
            walkPath: $currentPath,
            welcomeScreens: $welcomeScreens,
            thankyouScreens: $thankyouScreens,
        });

        if (currentBlockBeingEdited)
            goToBlock(currentBlockBeingEdited);

    }, [
        blocks,
        currentBlockBeingEdited,
        hasThemesFinishedResolution,
    ]);


    // Ensure the active child block is visible on the screen
    useEffect(() => {
        if (currentChildBlockId) {
            const blockElement = document.querySelector(`.renderer-core-child-block-${currentChildBlockId}`);
            if (blockElement) {
                const rect = blockElement.getBoundingClientRect();
                const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

                if (!isVisible) {
                    blockElement.scrollIntoView({
                        behavior: 'smooth', // Smooth scrolling
                        block: 'end', // Scroll to the center of the viewport
                        inline: 'nearest',
                    });

                }
            }
        }
    }, [currentChildBlockId]);

    return (
        <div className={classnames("block-editor-block-edit__skeleton", {
            'is-child-active': currentChildBlockId
        })}>
            {!hasThemesFinishedResolution || !hasFontsFinishedResolution ? (
                <div
                    className={classnames(
                        'builder-core-preview-area-wrapper__loader',
                        css`
							display: flex;
							width: 100%;
							height: 100%;
							background: #fff;
							align-items: center;
							justify-content: center;
						`
                    )}
                >
                    <Loader color="#333" height={30} width={30} />
                </div>
            ) : (
                <>
                    {blocks.length > 0 && (

                        <Form
                            formObj={{
                                blocks: cloneDeep(blocks),
                                theme: currentTheme?.properties,
                                messages,
                                themesList: $themesList,
                                settings,
                                customCSS,
                            }
                            }
                            applyLogic={false}
                            customFonts={customFontsList}
                            onSubmit={() => { }}
                            editor={{
                                mode: 'on',
                                editLabel,
                                editDescription,
                                isChildActive: (id) => id === currentChildBlockId,
                                setIsChildActive: (id) => setCurrentChildBlock(id),
                                onClick: (id) => {
                                    setCurrentBlock(id);
                                    setCurrentChildBlock(null);
                                },
                            }}
                            isPreview={true}
                        />
                    )}
                </>
            )}
        </div>
    );
};


export default Skeleton;
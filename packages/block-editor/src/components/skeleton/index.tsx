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
import { cloneDeep } from 'lodash';
import classnames from 'classnames';
import { withErrorBoundary } from "@quillforms/admin-components";

const editLabel = withErrorBoundary(({ childId, childIndex, parentId }) => {
    return <Editor childId={childId} childIndex={childIndex} parentId={parentId} type="label" />;
}, {
    title: 'Builder Editor Error',
    message: 'Error happened in the builder.',
    actionLabel: 'Retry',
    showDetails: true
})
const editDescription = withErrorBoundary(() => {
    return <Editor type="description" />;
}, {
    title: 'Builder  Editor Error',
    message: 'Error happened in the builder.',
    actionLabel: 'Retry',
    showDetails: true
});
const Skeleton = withErrorBoundary(() => {

    const { currentChildBlockId } = useSelect(select => {
        return {
            currentChildBlockId: select('quillForms/block-editor').getCurrentChildBlockId()
        }
    });

    const themeId = useCurrentThemeId();
    const currentTheme = useCurrentTheme();
    const {
        hasThemesFinishedResolution,
        hasFontsFinishedResolution,
        themesList,
        customFontsList,
        currentBlockBeingEdited,
        currentBlockBeingEditedId,
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
            ).getCurrentBlock(),
            currentChildBlockId: select('quillForms/block-editor').getCurrentChildBlockId(),
            currentBlockBeingEditedId: select('quillForms/block-editor').getCurrentBlockId(),
            blocks: select('quillForms/block-editor').getBlocks(true),
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
        if (!currentBlockBeingEditedId && blocks.length > 0) {
            setCurrentBlock(blocks[0].id);
        }
    }, [hasThemesFinishedResolution]);



    useEffect(() => {
        if (currentBlockBeingEdited?.name === 'partial-submission-point') return;
        // const formFields = blocks.filter(
        //     (block) =>
        //         block.name !== 'thankyou-screen' &&
        //         block.name !== 'welcome-screen' &&
        //         block.name !== 'partial-submission-point'
        // );

        // // const $thankyouScreens = blocks
        // //     .filter((block) => block.name === 'thankyou-screen')
        // //     .concat({
        // //         id: 'default_thankyou_screen',
        // //         name: 'thankyou-screen',
        // //     });

        // // const $welcomeScreens = map(
        // //     blocks.filter((block) => block.name === 'welcome-screen'),
        // //     (block) => omit(block, ['name'])
        // // );



        // // const $currentPath = cloneDeep(formFields);
        // // // setSwiper({
        // // //     walkPath: $currentPath,
        // // //     welcomeScreens: $welcomeScreens,
        // // //     thankyouScreens: $thankyouScreens,
        // // //     currentBlockId: currentBlockBeingEdited?.id,
        // // // });

        if (currentBlockBeingEditedId !== undefined && currentBlockBeingEditedId !== 'partial-submission-point')
            goToBlock(currentBlockBeingEditedId);

    }, [
        // blocks,
        currentBlockBeingEditedId,
        currentChildBlockId,
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
            {blocks.length > 0 && (
                <Form
                    formObj={{
                        blocks: cloneDeep(blocks).filter(block => block.name !== 'partial-submission-point'),
                        theme: currentTheme?.properties,
                        messages,
                        // partialSubmissionPoint,
                        themesList: $themesList,
                        settings,
                        customCSS,

                    }}
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
                            setCurrentChildBlock(null);
                            setCurrentBlock(id);
                        },
                    }}
                />
            )}
        </div>
    )
}, {
    title: 'Builder Error',
    message: 'Error happened in the builder.',
    actionLabel: 'Retry',
    showDetails: true
});





export default Skeleton;
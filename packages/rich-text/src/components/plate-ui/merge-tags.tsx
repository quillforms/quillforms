import React from 'react';
import { PlateElement, PlateElementProps, focusEditor, usePlateEditorState } from '@udecode/plate-common';
import { css } from 'emotion';
import { ReactEditor } from 'slate-react';
const MergeTags = () => {
    const editor = usePlateEditorState();


    return (
        <div className={
            css`
                padding: 5px 10px;
                border-radius: 5px;
                background-color: #e8e8e8;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #000;
            `
        } contentEditable={false} onClick={() => {
            editor.insertText("@");
            // I need to focus on editor after inserting the node.
            focusEditor(editor);
        }}>
            Recall Information
        </div>
    );
};
export default MergeTags;
/**
 * QuillForms Dependencies.
 */
import { Button } from '@quillforms/admin-components';

/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CheckboxControl, FormFileUpload } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { ThreeDots as Loader } from 'react-loader-spinner';
import classnames from 'classnames';

const Import = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { createErrorNotice, createSuccessNotice } =
        useDispatch('core/notices');

    const uploadHandler = () => {
        if (!file) {
            return;
        }

        // Check if not json file.
        if (file.type !== 'application/json') {
            createErrorNotice(
                __('⛔ Invalid file type!', 'quillforms'),
                {
                    type: 'snackbar',
                    isDismissible: true,
                }
            );
            return;
        }

        setIsLoading(true);
        const formData = new FormData();
        formData.append('json_file', file);
        apiFetch({
            path: `/qf/v1/import-export/import`,
            method: 'POST',
            body: formData,
        })
            .then((res) => {
                if (res.success) {
                    setFile(null);
                    createSuccessNotice(
                        __('✅ Imported successfully!', 'quillforms'),
                        {
                            type: 'snackbar',
                            isDismissible: true,
                        }
                    );
                } else {
                    createErrorNotice(
                        __('⛔ Something went wrong!', 'quillforms'),
                        {
                            type: 'snackbar',
                            isDismissible: true,
                        }
                    );
                }
            })
            .catch(() => {
                createErrorNotice(
                    __('Something went wrong!', 'quillforms'),
                    {
                        type: 'snackbar',
                        isDismissible: true,
                    }
                );
            });
        setIsLoading(false);
    };

    return (
        <div className="quillforms-import-export-import-tab">
            <h2>{__('Import', 'quillforms')}</h2>
            <FormFileUpload
                accept=".json"
                onChange={(event) => {
                    setFile(event.target.files[0]);
                }}
                render={({ openFileDialog }) => (
                    <div
                        className={classnames("quillforms-import-export-import-tab__upload",
                            css`
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                padding: 10px 15px;
                                border: 1px solid #e2e4e7;
                                cursor: pointer;
                                .quillforms-import-export-import-tab__upload__text {
                                    font-size: 14px;
                                    line-height: 1.5;
                                    color: #32373c;
                                }

                                .components-button {
                                    margin-left: 10px;
                                }
                        `)}
                        onClick={openFileDialog}
                    >
                        <div className="quillforms-import-export-import-tab__upload__text">
                            {file ? file.name : __('Choose a file', 'quillforms')}
                        </div>
                        <Button isPrimary>
                            {__('Browse', 'quillforms')}
                        </Button>
                    </div>
                )}
            />
            <div className="quillforms-import-export-import-tab__upload__button" style={{
                marginTop: '20px',
            }}>
                {isLoading ? (
                    <Loader
                        type="ThreeDots"
                        color="#646fd4"
                        height={30}
                        width={30}
                    />
                ) : (
                    <Button isPrimary onClick={uploadHandler}>
                        {__('Import', 'quillforms')}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Import;
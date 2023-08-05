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
import { CheckboxControl } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import { ThreeDots as Loader } from 'react-loader-spinner';

const Export = () => {
    const [isFetchingOnMount, setIsFetchingOnMount] = useState(true);
    const [selectedForms, setSelectedForms] = useState([]);

    const { invalidateResolution } = useDispatch('core/data');
    const recordArgs = [
        'postType',
        'quill_forms',
        {
            status: 'publish',
            per_page: -1,
        },
    ];
    const { forms, hasFormsFinishedResolution } = useSelect((select) => {
        return {
            forms: select('core').getEntityRecords(...recordArgs),
            hasFormsFinishedResolution: select('core').hasFinishedResolution(
                'getEntityRecords',
                recordArgs
            ),
        };
    }, []);

    // Invalidate resolution for entity record on unmount.
    useEffect(() => {
        return () => {
            invalidateResolution('core', 'getEntityRecords', recordArgs);
        };
    }, []);

    useEffect(() => {
        if (hasFormsFinishedResolution) {
            setIsFetchingOnMount(false);
        } else {
            setIsFetchingOnMount(true);
        }
    }, [hasFormsFinishedResolution]);

    const { createErrorNotice, createSuccessNotice } =
        useDispatch('core/notices');

    const exportForms = () => {
        if (selectedForms.length === 0) {
            createErrorNotice(
                __(
                    '⛔ Please select at least one form to export.',
                    'quillforms'
                ),
                {
                    type: 'snackbar',
                    isDismissible: true,
                }
            );
            return;
        }
        const data = {
            formIds: selectedForms,
        };
        apiFetch({
            path: `/qf/v1/import-export/export`,
            method: 'POST',
            data,
            parse: false,
        })
            .then(res => res.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `quillforms-export-${new Date().toISOString().slice(0, 10)}.json`
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                createSuccessNotice(
                    __(
                        '✅ Forms exported successfully.',
                        'quillforms'
                    ),
                    {
                        type: 'snackbar',
                        isDismissible: true,
                    }
                );
            })
            .catch((err) => {
                console.error(err);
                createErrorNotice(
                    __(
                        '⛔ Something went wrong while exporting forms.',
                        'quillforms'
                    ),
                    {
                        type: 'snackbar',
                        isDismissible: true,
                    }
                );
            });
    };

    return (
        <div className='quillforms-import-export-export-tab'>
            {isFetchingOnMount && (
                <div
                    className={css`
							display: flex;
							flex-wrap: wrap;
							width: 100%;
							height: 100px;
							justify-content: center;
							align-items: center;
						` }
                >
                    <Loader color="#8640e3" height={50} width={50} />
                </div>
            )}
            {!isFetchingOnMount && (
                <>
                    {forms.length === 0 && (
                        <div className='quillforms-import-export-export-tab__no-forms'>
                            <h2>{__('No forms found.', 'quillforms')}</h2>
                            <p>{__('Please create a form first.', 'quillforms')}</p>
                        </div>
                    )}
                    {forms.length > 0 && (
                        <div className='quillforms-import-export-export-tab__forms'>
                            <h2>{__('Select forms to export', 'quillforms')}</h2>
                            <p>
                                {__('Select the forms you want to export. You can export multiple forms at once.', 'quillforms')}
                            </p>
                            <div className='quillforms-import-export-export-tab__forms-list'>
                                <div
                                    className='quillforms-import-export-export-tab__select-all'
                                    style={{
                                        marginBottom: '20px',
                                    }}
                                >
                                    <CheckboxControl
                                        label={__('Select All', 'quillforms')}
                                        checked={selectedForms.length === forms.length}
                                        onChange={() => {
                                            if (selectedForms.length === forms.length) {
                                                setSelectedForms([]);
                                            } else {
                                                setSelectedForms(forms.map((form) => form.id));
                                            }
                                        }}
                                    />
                                </div>
                                {forms.map((form) => (
                                    <CheckboxControl
                                        key={form.id}
                                        label={form.title.raw}
                                        checked={selectedForms.includes(form.id)}
                                        onChange={() => {
                                            if (selectedForms.includes(form.id)) {
                                                setSelectedForms(
                                                    selectedForms.filter((id) => id !== form.id)
                                                );
                                            } else {
                                                setSelectedForms([...selectedForms, form.id]);
                                            }
                                        }}
                                    />
                                ))}
                            </div>
                            <div
                                className='quillforms-import-export-export-tab__export-button'
                                style={{
                                    marginTop: '20px',
                                }}
                            >
                                <Button isLarge isPrimary onClick={exportForms}>
                                    {__('Export', 'quillforms')}
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Export;
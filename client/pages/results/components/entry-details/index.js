/**
 * QuillForms Dependencies
 */
import { __experimentalAddonFeatureAvailability } from '@quillforms/admin-components';
import ConfigAPI from "@quillforms/config";

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { TabPanel } from '@wordpress/components';
import { applyFilters } from '@wordpress/hooks';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import DeleteIcon from '../delete-icon';
import DeleteAlertModal from '../delete-alert';
import Details from './details';
import Notes from './notes';
import UserSubmissionInfo from './user-submission-info';

export const EntryDetails = ({ recordsInfo, entry, formId, deleteEntry }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [modelOpen, setModalOpen] = useState(false);
    const isWPEnv = ConfigAPI.isWPEnv();
    const onDelete = () => {
        setIsDeleting(true);
        apiFetch({
            path: `/qf/v1/forms/${formId}/entries/${entry.ID}`,
            method: 'DELETE',
        }).then((res) => {
            if (res) {
                setIsDeleting(false);
                setModalOpen(false);
                deleteEntry(entry.ID);
            }
        });
    };

    const Tabs = applyFilters('QuillForms.Entires.EntryDetails.Tabs', {
        details: {
            title: __('Details', 'quillforms'),
            render: <Details recordsInfo={recordsInfo} entry={entry} />,
        },
        notes: {
            title: __('Notes', 'quillforms'),
            render: <Notes entry={entry} />,
        },
        pdf_export: {
            title: __('PDF Export', 'quillforms'),
            render: <__experimentalAddonFeatureAvailability
                featureName={__("PDF Export", "quillforms")}
                addonSlug={"pdf"}
                showLockIcon={true}
            />,
        }
    }, entry, formId);

    return (
        <div className="qf-entry-details">
            {entry && (
                <>
                    <div className="qf-entry-details__header">
                        <div className="qf-entry-details__id">
                            ID: {entry.ID}
                        </div>
                        <div
                            className={css`
								display: inline-flex;
								align-items: center;
							` }
                        >
                            <div className="qf-entry-details__date">
                                Date: {entry.date_created}
                            </div>
                            <div
                                className={css`
									display: inline-flex;
									align-items: center;
									height: 50px;
									margin-left: 10px;
								` }
                            >
                                <div
                                    className="qf-entry-details__delete-entry"
                                    onClick={() => {
                                        setModalOpen(true);
                                    }}
                                >
                                    <DeleteIcon />
                                </div>
                            </div>
                            <div
                                className={css`
									display: inline-flex;
									align-items: center;
									height: 50px;
									margin-left: 10px;
								` }
                            >
                                <div
                                    className="qf-entry-details__export-entry-pdf"
                                    onClick={() => { }}
                                >

                                </div>
                            </div>
                        </div>
                    </div>
                    {isWPEnv &&
                        <UserSubmissionInfo entry={entry} />
                    }

                    <TabPanel
                        className={css`
						.components-tab-panel__tabs-item {
							font-weight: normal;
						}
						.active-tab {
							font-weight: bold;
						}
					` }
                        activeClass="active-tab"
                        tabs={Object.entries(Tabs).map(([name, tab]) => {
                            return {
                                name,
                                title: tab.title,
                                className: 'tab-' + name,
                            };
                        })}
                        initialTabName={'details'}
                    >
                        {(tab) => (
                            <div>
                                {Tabs[tab.name]?.render ?? <div>{__('Not Found', 'quillforms')}</div>}
                            </div>
                        )}
                    </TabPanel>
                    {modelOpen && (
                        <DeleteAlertModal
                            isDeleting={isDeleting}
                            closeModal={() => {
                                setModalOpen(false);
                            }}
                            approve={() => {
                                onDelete();
                            }}
                        />
                    )}
                </>
            )}
        </div>
    );
};

/**
 * WordPress Dependencies
 */
import { TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

/**
 * Internal Dependencies
 */
import './style.scss';
import Import from './import';
import Export from './export';

const ImportExport = () => {
    const getTab = (name) => {
        switch (name) {
            case 'import':
                return <Import />;
            case 'export':
                return <Export />;
            default:
                return <div>{__('Not Found', 'quillforms')}</div>;
        }
    };

    return (
        <div className="quillforms-import-export-page">
            <h1 className="quillforms-import-export-page__heading">
                {__('Import & Export', 'quillforms')}
            </h1>
            <div className="quillforms-import-export-page__body">
                <TabPanel
                    className={css`
                        .components-tab-panel__tabs-item {
                            font-weight: normal;
                        }
                        .active-tab {
                            font-weight: bold;
                        }
                    `}
                    activeClass="active-tab"
                    tabs={[
                        {
                            name: 'import',
                            title: __('Import', 'quillforms'),
                            className: 'tab-import',
                        },
                        {
                            name: 'export',
                            title: __('Export', 'quillforms'),
                            className: 'tab-export',
                        },
                    ]}
                >
                    {(tab) => <div>{getTab(tab.name)}</div>}
                </TabPanel>
            </div>
        </div>
    );
};

export default ImportExport;
/**
 * QuillForms Dependencies
 */
import {
    BaseControl,
    ControlWrapper,
    ControlLabel,
    TextControl,
    ToggleControl,
} from '@quillforms/admin-components';

/**
 * WordPress Dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { css } from 'emotion';

const EmailControls = (props) => {
    const {
        id,
        attributes: { allowedDomains, restrictDomains, placeholder, disallowedDomains },
        setAttributes,
    } = props;

    // Local states
    const [domainInput, setDomainInput] = useState('');
    const [domainError, setDomainError] = useState('');
    const [disallowedDomainInput, setDisallowedDomainInput] = useState('');
    const [disallowedDomainError, setDisallowedDomainError] = useState('');

    // Domain validation regex
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

    const validateDomain = (domain, list = [], otherList = []) => {
        if (!domain) {
            setDomainError(__('Domain cannot be empty', 'quillforms'));
            return false;
        }
        domain = domain.trim().toLowerCase();
        if (list?.includes(domain)) {
            setDomainError(__('Domain already exists', 'quillforms'));
            return false;
        }
        if (otherList?.includes(domain)) {
            setDomainError(__('Domain cannot be in both allowed and disallowed lists', 'quillforms'));
            return false;
        }
        if (!domainRegex.test(domain)) {
            setDomainError(__('Invalid domain format (e.g., example.com)', 'quillforms'));
            return false;
        }
        setDomainError('');
        return true;
    };

    const validateDisallowedDomain = (domain, list = [], otherList = []) => {
        if (!domain) {
            setDisallowedDomainError(__('Domain cannot be empty', 'quillforms'));
            return false;
        }
        domain = domain.trim().toLowerCase();
        if (list?.includes(domain)) {
            setDisallowedDomainError(__('Domain already exists', 'quillforms'));
            return false;
        }
        if (otherList?.includes(domain)) {
            setDisallowedDomainError(__('Domain cannot be in both allowed and disallowed lists', 'quillforms'));
            return false;
        }
        if (!domainRegex.test(domain)) {
            setDisallowedDomainError(__('Invalid domain format (e.g., example.com)', 'quillforms'));
            return false;
        }
        setDisallowedDomainError('');
        return true;
    };

    const handleAddDomain = () => {
        const domain = domainInput.trim().toLowerCase();
        if (validateDomain(domain, allowedDomains, disallowedDomains)) {
            const newDomains = [...(allowedDomains || []), domain];
            setAttributes({ allowedDomains: newDomains });
            setDomainInput('');
            setDomainError('');
        }
    };

    const handleAddDisallowedDomain = () => {
        const domain = disallowedDomainInput.trim().toLowerCase();
        if (validateDisallowedDomain(domain, disallowedDomains, allowedDomains)) {
            const newDomains = [...(disallowedDomains || []), domain];
            setAttributes({ disallowedDomains: newDomains });
            setDisallowedDomainInput('');
            setDisallowedDomainError('');
        }
    };

    const handleRemoveDomain = (domain) => {
        const newDomains = allowedDomains.filter(d => d !== domain);
        setAttributes({ allowedDomains: newDomains });
    };

    const handleRemoveDisallowedDomain = (domain) => {
        const newDomains = disallowedDomains.filter(d => d !== domain);
        setAttributes({ disallowedDomains: newDomains });
    };

    return (
        <BaseControl>
            <ControlWrapper orientation="horizontal">
                <ControlLabel label={__("Restrict Email Domains", "quillforms")} isNew />
                <ToggleControl
                    checked={restrictDomains}
                    onChange={() => {
                        setAttributes({ restrictDomains: !restrictDomains });
                    }}
                />
            </ControlWrapper>
            <div>
                {restrictDomains && (
                    <div className={css`
                        margin-top: 10px;
                    `}>
                        <div className={css`
                            position: relative;
                            margin-bottom: ${domainError ? '25px' : '10px'};
                        `}>
                            <TextControl
                                label={__("Add Allowed Domain", "quillforms")}
                                value={domainInput}
                                onChange={(value) => {
                                    setDomainInput(value);
                                    setDomainError('');
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddDomain();
                                    }
                                }}
                                placeholder="example.com"
                                className={css`
                                    ${domainError ? 'border-color: #cc1818;' : ''}
                                `}
                            />
                            {domainError && (
                                <div className={css`
                                    color: #cc1818;
                                    font-size: 12px;
                                    margin-top: 5px;
                                    position: absolute;
                                    bottom: -20px;
                                `}>
                                    {domainError}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleAddDomain}
                            className={css`
                                margin-top: 5px;
                                padding: 5px 10px;
                                background: #007cba;
                                color: white;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                                &:hover {
                                    background: #006ba1;
                                }
                                &:disabled {
                                    background: #ccc;
                                    cursor: not-allowed;
                                }
                            `}
                            disabled={!domainInput.trim()}
                        >
                            {__("Add Domain", "quillforms")}
                        </button>

                        {allowedDomains?.length > 0 && (
                            <div className={css`
                                margin-top: 15px;
                                border-top: 1px solid #ddd;
                                padding-top: 10px;
                            `}>
                                <ControlLabel label={__("Allowed Domains", "quillforms")} />
                                {allowedDomains.map((domain) => (
                                    <div key={domain} className={css`
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        padding: 5px;
                                        margin: 5px 0;
                                        background: #f0f0f0;
                                        border-radius: 3px;
                                    `}>
                                        <span>{domain}</span>
                                        <button
                                            onClick={() => handleRemoveDomain(domain)}
                                            className={css`
                                                background: #dc3232;
                                                color: white;
                                                border: none;
                                                border-radius: 3px;
                                                padding: 3px 8px;
                                                cursor: pointer;
                                                &:hover {
                                                    background: #c32121;
                                                }
                                            `}
                                        >
                                            {__("Remove", "quillforms")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Disallowed Domains Section */}
                        <div className={css`
                            position: relative;
                            margin-bottom: ${disallowedDomainError ? '25px' : '10px'};
                            margin-top: 20px;
                        `}>
                            <TextControl
                                label={__("Add Disallowed Domain", "quillforms")}
                                value={disallowedDomainInput}
                                onChange={(value) => {
                                    setDisallowedDomainInput(value);
                                    setDisallowedDomainError('');
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddDisallowedDomain();
                                    }
                                }}
                                placeholder="example.com"
                                className={css`
                                    ${disallowedDomainError ? 'border-color: #cc1818;' : ''}
                                `}
                            />
                            {disallowedDomainError && (
                                <div className={css`
                                    color: #cc1818;
                                    font-size: 12px;
                                    margin-top: 5px;
                                    position: absolute;
                                    bottom: -20px;
                                `}>
                                    {disallowedDomainError}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleAddDisallowedDomain}
                            className={css`
                                margin-top: 5px;
                                padding: 5px 10px;
                                background: #007cba;
                                color: white;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                                &:hover {
                                    background: #006ba1;
                                }
                                &:disabled {
                                    background: #ccc;
                                    cursor: not-allowed;
                                }
                            `}
                            disabled={!disallowedDomainInput.trim()}
                        >
                            {__("Add Domain", "quillforms")}
                        </button>
                        {disallowedDomains?.length > 0 && (
                            <div className={css`
                                margin-top: 15px;
                                border-top: 1px solid #ddd;
                                padding-top: 10px;
                            `}>
                                <ControlLabel label={__("Disallowed Domains", "quillforms")} />
                                {disallowedDomains.map((domain) => (
                                    <div key={domain} className={css`
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        padding: 5px;
                                        margin: 5px 0;
                                        background: #f0f0f0;
                                        border-radius: 3px;
                                    `}>
                                        <span>{domain}</span>
                                        <button
                                            onClick={() => handleRemoveDisallowedDomain(domain)}
                                            className={css`
                                                background: #dc3232;
                                                color: white;
                                                border: none;
                                                border-radius: 3px;
                                                padding: 3px 8px;
                                                cursor: pointer;
                                                &:hover {
                                                    background: #c32121;
                                                }
                                            `}
                                        >
                                            {__("Remove", "quillforms")}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </BaseControl>
    );
};

export default EmailControls;
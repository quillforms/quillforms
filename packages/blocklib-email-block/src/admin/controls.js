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
        attributes: { allowedDomains, restrictDomains, placeholder },
        setAttributes,
    } = props;

    // Local states
    const [domainInput, setDomainInput] = useState('');
    const [domainError, setDomainError] = useState('');

    // Domain validation regex
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;

    const validateDomain = (domain) => {
        if (!domain) {
            setDomainError(__('Domain cannot be empty', 'quillforms'));
            return false;
        }

        // Remove any whitespace
        domain = domain.trim().toLowerCase();

        // Check if domain already exists
        if (allowedDomains?.includes(domain)) {
            setDomainError(__('Domain already exists', 'quillforms'));
            return false;
        }

        // Test against regex
        if (!domainRegex.test(domain)) {
            setDomainError(__('Invalid domain format (e.g., example.com)', 'quillforms'));
            return false;
        }

        setDomainError('');
        return true;
    };

    const handleAddDomain = () => {
        const domain = domainInput.trim().toLowerCase();

        if (validateDomain(domain)) {
            const newDomains = [...(allowedDomains || []), domain];
            setAttributes({ allowedDomains: newDomains });
            setDomainInput('');
            setDomainError('');
        }
    };

    const handleRemoveDomain = (domain) => {
        const newDomains = allowedDomains.filter(d => d !== domain);
        setAttributes({ allowedDomains: newDomains });
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
                    </div>
                )}
            </div>
        </BaseControl>
    );
};

export default EmailControls;
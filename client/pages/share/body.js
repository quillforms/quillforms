import CodeIcon from "./code-icon";
import LinkIcon from "./link-icon";
import PopupIcon from "./popup-icon";
import ShareIcon from "./share-icon"
import { useEffect, useState } from "react";
import { useSelect } from "@wordpress/data";
import { Modal } from "@wordpress/components";
import { ComboColorPicker, ColorPicker } from "@quillforms/theme-editor";
import { Button } from "@quillforms/admin-components";
import { css } from "emotion";
import QRCode from "react-qr-code";
import QRCodeIcon from "./qrcode-icon";
import { __ } from "@wordpress/i18n";

import configApi from "@quillforms/config";
import { size } from "lodash";

const hiddenFieldsContainer = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    margin: 20px 0;
`;

const hiddenFieldRow = css`
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    label {
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 4px;
    }

    input {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        font-size: 14px;
        line-height: 20px;
        color: #1F2937;
        background-color: #FFFFFF;
        transition: all 0.2s ease;
        
        &::placeholder {
            color: #9CA3AF;
        }
        
        &:hover {
            border-color: #D1D5DB;
        }
        
        &:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        
        /* Prevent gray background on autofill */
        &:-webkit-autofill,
        &:-webkit-autofill:hover,
        &:-webkit-autofill:focus,
        &:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px white inset !important;
            box-shadow: 0 0 0 30px white inset !important;
            -webkit-text-fill-color: #1F2937 !important;
            transition: background-color 5000s ease-in-out 0s;
        }
    }
`;

const routingTypeSelect = css`
    margin-top: 20px;

    label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
    }

    select {
        width: 100%;
        padding: 10px 14px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        font-size: 14px;
        line-height: 20px;
        color: #1F2937;
        background-color: #FFFFFF;
        cursor: pointer;
        transition: all 0.2s ease;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 12px center;
        padding-right: 40px;

        &:hover {
            border-color: #D1D5DB;
        }

        &:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
    }
`;

const generatedLinkContainer = css`
    margin-top: 24px;
    
    h4 {
        font-size: 16px;
        font-weight: 500;
        color: #374151;
        margin: 0 0 12px 0;
    }
`;

const linkRow = css`
    display: flex;
    gap: 12px;
    align-items: center;

    input {
        flex: 1;
        padding: 10px 14px;
        border: 1px solid #E5E7EB;
        border-radius: 6px;
        font-size: 14px;
        line-height: 20px;
        color: #1F2937;
        background-color: #FFFFFF;
        min-width: 400px;
        cursor: text;
        
        &:focus {
            outline: none;
            border-color: #2563EB;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
    }

    button {
        min-width: 80px;
        transition: all 0.2s ease;
        
        &:hover {
            transform: translateY(-1px);
        }
        
        &:active {
            transform: translateY(0);
        }
    }
`;

const ShareBody = ({ payload }) => {



    const isWPEnv = configApi.isWPEnv();

    const [modalState, setModalState] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [popupSettings, setPopupSettings] = useState({
        buttonTitle: 'Open Form',
        buttonBackgroundColor: '#000000',
        buttonTextColor: '#ffffff',
        buttonBorderRadius: '24',
        buttonBorderWidth: '0',
        buttonBorderColor: '#000000',
        buttonFontSize: '16',
        buttonPadding: {
            top: 10,
            right: 20,
            bottom: 10,
            left: 20,
        },
        popupMaxWidth: '90',
        popupMaxWidthUnit: '%',
        popupMaxHeight: '100',
        popupMaxHeightUnit: '%',

    });

    const copyToClipboard = async (text) => {
        try {
            // Try modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                setIsCopied(true);
                return;
            }

            // Fallback for older browsers or non-HTTPS
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                setIsCopied(true);
            } else {
                console.error('Copy failed');
                // Optionally show an error message to user
            }
        } catch (err) {
            console.error('Copy failed:', err);
            // Fallback: create a temporary input for manual copy
            const input = document.createElement('input');
            input.value = text;
            input.style.position = 'fixed';
            input.style.opacity = '0';
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, 99999); // For mobile devices

            // Show a message to manually copy
            alert('Please manually copy the text: Ctrl+C (Cmd+C on Mac)');

            setTimeout(() => {
                document.body.removeChild(input);
            }, 100);
        }
    };
    // Add this shortcodeSettings state
    const [shortcodeSettings, setShortcodeSettings] = useState({
        width: { value: 100, unit: '%' },
        minHeight: { value: 500, unit: 'px' },
        maxHeight: { value: 0, unit: 'auto' }
    });

    const [fieldValues, setFieldValues] = useState({});
    const [routingType, setRoutingType] = useState('query');

    const generateURL = () => {
        // Remove trailing slash from baseURL
        const baseURL = (payload?.link || '').replace(/\/+$/, '');
        const filledFields = Object.entries(fieldValues)
            .filter(([_, value]) => value)
            .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
            .join('&');

        if (!filledFields) return baseURL;

        if (routingType === 'query') {
            return `${baseURL}${baseURL.includes('?') ? '&' : '?'}${filledFields}`;
        } else {
            return `${baseURL}#${filledFields}`;
        }
    };


    const generateShortcode = () => {
        const width = `${shortcodeSettings.width.value}${shortcodeSettings.width.unit}`;
        const minHeight = `${shortcodeSettings.minHeight.value}${shortcodeSettings.minHeight.unit}`;
        const maxHeight = shortcodeSettings.maxHeight.unit === 'auto'
            ? 'auto'
            : `${shortcodeSettings.maxHeight.value}${shortcodeSettings.maxHeight.unit}`;

        return `[quillforms id="${payload?.id}" width="${width}" min_height="${minHeight}" max_height="${maxHeight}"]`;
    };


    const downloadQR = () => {
        const svg = document.querySelector(".quillforms-qr-share-modal svg");
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = "quillforms-qrcode";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    const popupShortcode = `[quillforms-popup id="${payload?.id}" ${Object.keys(popupSettings).map(($key) => {
        if ($key === "buttonPadding") {
            return `buttonPadding="${Object.keys(popupSettings[$key]).map(($paddingKey) => {
                return `${popupSettings[$key][$paddingKey]}px`;
            }).join(" ")}"`;
        }
        return `${$key}="${popupSettings[$key]}"`;
    }).join(" ")} ]`;


    useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false);
            }, 4000);
        }
    }, [isCopied]);

    const hiddenFields = payload.hidden_fields

    return (
        <div className="quillforms-share-page">
            <div className="quillforms-share-page-header">
                <ShareIcon />
                <div className="quillforms-share-page-heading">
                    <p>{__('Share Your Form with Others using Multiple Options', 'quillforms')}</p>
                    <p>
                        {__('To share your form with others, you have several options available. You can share it via a direct link, shortcode, embed code, or pop-up. Choose the method that best suits your needs and preferences to ensure easy and convenient access for your audience.', 'quillforms')}
                    </p>
                </div>
            </div>
            <div className="quillforms-share-page-body">
                <div className="quillforms-share-card" onClick={() => {
                    setModalState('link');
                }}>
                    <div className="quillforms-share-card-header">
                        <LinkIcon />
                        <h3>{__('Direct Link', 'quillforms')}</h3>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>{__('Copy the form link and share it with your audience.', 'quillforms')}</p>
                    </div>
                </div>
                {isWPEnv && (
                    <div className="quillforms-share-card" onClick={() => {
                        setModalState('shortcode');
                    }}>
                        <div className="quillforms-share-card-header">
                            <h3 style={{
                                marginTop: 0,
                                fontSize: "22px",
                                marginBottom: "34px"
                            }}>[ / ]</h3>
                            <h3>{__('Shortcode', 'quillforms')}</h3>
                        </div>
                        <div className="quillforms-share-card-body">
                            <p>{__('Copy the shortcode and paste it into your post or page.', 'quillforms')}</p>
                        </div>
                    </div>
                )}
                <div className="quillforms-share-card" onClick={() => {
                    setModalState('embed');
                }}>
                    <div className="quillforms-share-card-header">
                        <CodeIcon />
                        <h3>{__('Embed Code', 'quillforms')}</h3>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>{__('Embed code is useful to share the form in an external web page. Copy the code and paste it into your external post or page.', 'quillforms')}</p>
                    </div>
                </div>
                {isWPEnv && (
                    <div className="quillforms-share-card" onClick={() => {
                        setModalState('popup');
                    }}>
                        <div className="quillforms-share-card-header">
                            <div className={css`
                                display: flex;
                                align-items: flex-start;
                                justify-content: space-between;
                            `}>
                                <div>
                                    <PopupIcon />
                                    <h3>{__('Popup', 'quillforms')}</h3>
                                </div>
                                <div className="admin-components-control-label__new-feature">
                                    NEW
                                </div>
                            </div>
                        </div>
                        <div className="quillforms-share-card-body">
                            <p>{__('Display your form on a popup upon clicking a desinated button. Copy the shortcode and paste it into your post or page.', 'quillforms')}</p>
                        </div>
                    </div>
                )}
                <div className="quillforms-share-card" onClick={() => {
                    setModalState('qr');
                }}>
                    <div className="quillforms-share-card-header">
                        <div className={css`
                            display: flex;
                            align-items: flex-start;
                            justify-content: space-between;
                        `}>
                            <div>
                                <QRCodeIcon />
                                <h3>{__('QR Code', 'quillforms')}</h3>
                            </div>
                            <div className="admin-components-control-label__new-feature">
                                NEW
                            </div>
                        </div>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>{__('Share your form with others by scanning the QR code.', 'quillforms')}</p>
                    </div>
                </div>
            </div>
            {modalState === 'link' && (
                <Modal
                    title={__('Direct Link', 'quillforms')}
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                >
                    <div className="quillforms-share-modal">
                        {size(hiddenFields) > 0 && (
                            <>
                                <div className="quillforms-hidden-fields-settings">


                                    <h4>{__('Hidden Fields', 'quillforms')}</h4>

                                    <div className={hiddenFieldsContainer}>
                                        {hiddenFields.map((field) => {
                                            if (field.name.trim()) {
                                                return (
                                                    <div key={field.name} className={hiddenFieldRow}>
                                                        <label>{field.name}</label>
                                                        <input
                                                            type="text"
                                                            value={fieldValues[field.name] || ''}
                                                            placeholder={__('Enter value for ', 'quillforms') + field.name}
                                                            onChange={(e) => {
                                                                setFieldValues(prev => ({
                                                                    ...prev,
                                                                    [field.name]: e.target.value
                                                                }));
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>

                                    <div className={routingTypeSelect}>
                                        <label>{__('Parameter Type:', 'quillforms')}</label>
                                        <select
                                            value={routingType}
                                            onChange={(e) => setRoutingType(e.target.value)}
                                        >
                                            <option value="query">{__('Query String (?param=value)', 'quillforms')}</option>
                                            <option value="hash">{__('Hash (#param=value)', 'quillforms')}</option>
                                        </select>
                                    </div>

                                </div>
                            </>
                        )}
                        <div className={generatedLinkContainer}>
                            <h4>{__('Generated URL', 'quillforms')}</h4>
                            <div className={linkRow}>
                                <input
                                    type="text"
                                    value={generateURL()}
                                    readOnly
                                />
                                <Button
                                    isPrimary
                                    onClick={() => {
                                        copyToClipboard(generateURL());
                                        setIsCopied(true);
                                    }}
                                >
                                    {isCopied ? __('Copied!', 'quillforms') : __('Copy', 'quillforms')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {modalState === 'shortcode' && (
                <Modal
                    title={__('Shortcode', 'quillforms')}
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                >
                    <div className="quillforms-share-modal">
                        <p>{__('Customize your form display settings and copy the generated shortcode.', 'quillforms')}</p>

                        {/* Shortcode Settings */}
                        <div className="quillforms-shortcode-settings">
                            <div className="quillforms-shortcode-setting-row">
                                <label>{__('Width', 'quillforms')}</label>
                                <div className="quillforms-shortcode-setting-input">
                                    <input
                                        type="number"
                                        value={shortcodeSettings.width.value}
                                        onChange={(e) => {
                                            setShortcodeSettings(prev => ({
                                                ...prev,
                                                width: {
                                                    ...prev.width,
                                                    value: e.target.value
                                                }
                                            }));
                                        }}
                                    />
                                    <select
                                        value={shortcodeSettings.width.unit}
                                        onChange={(e) => {
                                            setShortcodeSettings(prev => ({
                                                ...prev,
                                                width: {
                                                    ...prev.width,
                                                    unit: e.target.value
                                                }
                                            }));
                                        }}
                                    >
                                        <option value="%">%</option>
                                        <option value="px">px</option>
                                        <option value="vw">vw</option>
                                    </select>
                                </div>
                            </div>

                            <div className="quillforms-shortcode-setting-row">
                                <label>{__('Minimum Height', 'quillforms')}</label>
                                <div className="quillforms-shortcode-setting-input">
                                    <input
                                        type="number"
                                        value={shortcodeSettings.minHeight.value}
                                        onChange={(e) => {
                                            setShortcodeSettings(prev => ({
                                                ...prev,
                                                minHeight: {
                                                    ...prev.minHeight,
                                                    value: e.target.value
                                                }
                                            }));
                                        }}
                                    />
                                    <select
                                        value={shortcodeSettings.minHeight.unit}
                                        onChange={(e) => {
                                            setShortcodeSettings(prev => ({
                                                ...prev,
                                                minHeight: {
                                                    ...prev.minHeight,
                                                    unit: e.target.value
                                                }
                                            }));
                                        }}
                                    >
                                        <option value="px">px</option>
                                        <option value="vh">vh</option>
                                    </select>
                                </div>
                            </div>

                            <div className="quillforms-shortcode-setting-row">
                                <label>{__('Maximum Height', 'quillforms')}</label>
                                <div className="quillforms-shortcode-setting-input">
                                    <input
                                        type="number"
                                        value={shortcodeSettings.maxHeight.value}
                                        onChange={(e) => {
                                            setShortcodeSettings(prev => ({
                                                ...prev,
                                                maxHeight: {
                                                    ...prev.maxHeight,
                                                    value: e.target.value
                                                }
                                            }));
                                        }}
                                    />
                                    <select
                                        value={shortcodeSettings.maxHeight.unit}
                                        onChange={(e) => {
                                            setShortcodeSettings(prev => ({
                                                ...prev,
                                                maxHeight: {
                                                    ...prev.maxHeight,
                                                    unit: e.target.value
                                                }
                                            }));
                                        }}
                                    >
                                        <option value="px">px</option>
                                        <option value="vh">vh</option>
                                        <option value="auto">auto</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Generated Shortcode */}
                        <div className={generatedLinkContainer}>
                            <h4>{__('Generated Shortcode', 'quillforms')}</h4>
                            <div className={linkRow}>
                                <input
                                    type="text"
                                    value={generateShortcode()}
                                    readOnly
                                />
                                <Button
                                    isPrimary
                                    onClick={() => {
                                        copyToClipboard(generateShortcode());
                                        setIsCopied(true);
                                    }}
                                >
                                    {isCopied ? __('Copied!', 'quillforms') : __('Copy', 'quillforms')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
            {modalState === 'embed' && (
                <Modal
                    title={__('Embed Code', 'quillforms')}
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                >
                    <div className="quillforms-share-modal">
                        <p>{__('Copy the embed code below and insert it in your external page.', 'quillforms')}</p>
                        <div className="quillforms-share-modal-link">
                            <input type="text" style={{ minWidth: "400px" }}
                                value={`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`} readOnly />
                            {isCopied ? (
                                <Button isPrimary>{__('Copied!', 'quillforms')}</Button>
                            ) : (

                                <Button isPrimary onClick={() => {
                                    navigator.clipboard.writeText(`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`);
                                    setIsCopied(true);
                                }}>{__('Copy', 'quillforms')}</Button>
                            )}
                        </div>
                    </div>
                </Modal >
            )
            }

            {modalState === 'popup' && (
                <Modal
                    title={__('Popup', 'quillforms')}
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                    className={
                        css`
                            width: 100% !important;
                            height: 100% !important;
                            max-height: 100%;
                            max-width: 100%;
                            margin-right: 0;
                            margin-left: 0;
                            margin-top: 0;
                            margin-bottom: 0;
                            border-radius: 0;

                            .components-modal__content {
                                padding: 20px 0 0;
                                margin-top: 60px;
                                background: #fafafa;
                                &:before {
                                    display: none;
                                }
                                .components-modal__header {
                                    margin: 0 0 45px;
        
                                    div {
                                        justify-content: center;
                                    }
                                }
                            }
                        `
                    }
                >
                    <div className={css`
                        display: flex;
                        flex-direction: column;
                        max-width: 1000px;
                        margin: auto;
                    `}>

                        <div className="quillforms-share-popup-settings">
                            <div>
                                <h3>{__('Popup Settings', 'quillforms')}</h3>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button title', 'quillforms')}</label>
                                    <input type="text" value={popupSettings.buttonTitle} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonTitle: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button background color', 'quillforms')}</label>
                                    <ComboColorPicker
                                        color={popupSettings.buttonBackgroundColor}
                                        setColor={(color) => {
                                            setPopupSettings({
                                                ...popupSettings,
                                                buttonBackgroundColor: color
                                            });
                                        }}
                                    />

                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button text color', 'quillforms')}</label>
                                    <ColorPicker
                                        value={popupSettings.buttonTextColor}
                                        onChange={(color) => {
                                            setPopupSettings({
                                                ...popupSettings,
                                                buttonTextColor: color
                                            });
                                        }}
                                    />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button border radius(px)', 'quillforms')}</label>
                                    <input type="number" value={popupSettings.buttonBorderRadius} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonBorderRadius: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button border width(px)', 'quillforms')}</label>
                                    <input type="number" value={popupSettings.buttonBorderWidth} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonBorderWidth: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button border color', 'quillforms')}</label>
                                    <ColorPicker
                                        value={popupSettings.buttonBorderColor}
                                        onChange={(color) => {
                                            setPopupSettings({
                                                ...popupSettings,
                                                buttonBorderColor: color
                                            });
                                        }}
                                    />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button font size(px)', 'quillforms')}</label>
                                    <input type="number" value={popupSettings.buttonFontSize} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonFontSize: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Button padding(px)', 'quillforms')}</label>
                                    <div className="quillforms-share-popup-settings-row-padding-group">
                                        <div>
                                            <span>{__('Top', 'quillforms')}</span>
                                            <input type="number" value={popupSettings.buttonPadding.top} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    buttonPadding: {
                                                        ...popupSettings.buttonPadding,
                                                        top: e.target.value !== '' ? e.target.value : 0
                                                    }
                                                });
                                            }} />
                                        </div>
                                        <div>
                                            <span>{__('Right', 'quillforms')}</span>
                                            <input type="number" value={popupSettings.buttonPadding.right} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    buttonPadding: {
                                                        ...popupSettings.buttonPadding,
                                                        right: e.target.value !== '' ? e.target.value : 0
                                                    }
                                                });
                                            }} />
                                        </div>
                                        <div>
                                            <span>{__('Bottom', 'quillforms')}</span>
                                            <input type="number" value={popupSettings.buttonPadding.bottom} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    buttonPadding: {
                                                        ...popupSettings.buttonPadding,
                                                        bottom: e.target.value !== '' ? e.target.value : 0
                                                    }
                                                });
                                            }} />
                                        </div>
                                        <div>
                                            <span>{__('Left', 'quillforms')}</span>

                                            <input type="number" value={popupSettings.buttonPadding.left} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    buttonPadding: {
                                                        ...popupSettings.buttonPadding,
                                                        left: e.target.value !== '' ? e.target.value : 0
                                                    }
                                                });
                                            }} />
                                        </div>

                                    </div>
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Popup max width', 'quillforms')}</label>
                                    <div className="quillforms-share-popup-settings-row-max-width-group">
                                        <div>
                                            <input type="number" value={popupSettings.popupMaxWidth} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    popupMaxWidth: e.target.value !== '' ? e.target.value : 0
                                                });
                                            }} />
                                            <select value={popupSettings.popupMaxWidthUnit} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    popupMaxWidthUnit: e.target.value
                                                });
                                            }}>
                                                <option value="px">px</option>
                                                <option value="%">%</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>{__('Popup max height', 'quillforms')}</label>
                                    <div className="quillforms-share-popup-settings-row-max-height-group">
                                        <div>
                                            <input type="number" value={popupSettings.popupMaxHeight} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    popupMaxHeight: e.target.value !== '' ? e.target.value : 0
                                                });
                                            }} />
                                            <select value={popupSettings.popupMaxHeightUnit} onChange={(e) => {
                                                setPopupSettings({
                                                    ...popupSettings,
                                                    popupMaxHeightUnit: e.target.value
                                                });
                                            }}>
                                                <option value="px">px</option>
                                                <option value="%">%</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={css`
                                position: fixed;
                                right: 318px;
                                top: 100px;
                            `}>
                                <h3>{__('Preview', 'quillforms')}</h3>
                                <div className="quillforms-share-popup-preview">
                                    <a className={css`
                                    display: inline-block;
                                    background: ${popupSettings.buttonBackgroundColor};
                                    color: ${popupSettings.buttonTextColor} !important;
                                    border-radius: ${popupSettings.buttonBorderRadius}px;
                                    border: ${popupSettings.buttonBorderWidth}px solid ${popupSettings.buttonBorderColor};
                                    font-size: ${popupSettings.buttonFontSize}px;
                                    padding: ${popupSettings.buttonPadding.top ?? 0}px ${popupSettings.buttonPadding.right ?? 0}px ${popupSettings.buttonPadding.bottom ?? 0}px ${popupSettings.buttonPadding.left ?? 0}px;
                                `}>
                                        {popupSettings.buttonTitle}
                                    </a>
                                </div>
                                <p>{__('Copy the shortcode below and insert it in your WordPress page or post.', 'quillforms')}</p>
                                <div style={{
                                    minWidth: "100%", height: "140px", maxHeight: "150px", minHeight: "150px", maxWidth: "400px",
                                    padding: "10px",
                                    border: "1px solid #848282",
                                    background: "#eee",
                                    marginBottom: "10px",
                                }}>
                                    {popupShortcode}
                                </div>
                                {isCopied ? (
                                    <Button isPrimary>{__('Copied!', 'quillforms')}</Button>
                                ) : (

                                    <Button isPrimary onClick={() => {
                                        copyToClipboard(popupShortcode);
                                        setIsCopied(true);
                                    }}>{__('Copy', 'quillforms')}</Button>
                                )}
                            </div>
                        </div>


                    </div>
                </Modal >
            )
            }

            {modalState === 'qr' && (
                <Modal
                    title={__('QR Code', 'quillforms')}
                    onRequestClose={() => {
                        setModalState(null);
                    }}
                    className={
                        css`
                            
                            min-height: 600px;
                            max-width: 600px;

                            .components-modal__content {
                                padding: 20px 0 0;
                                margin-top: 60px;
                                background: #fafafa;
                                &:before {
                                    display: none;
                                }
                                .components-modal__header {
                                    margin: 0 0 45px;
        
                                    div {
                                        justify-content: center;
                                    }
                                }
                            }
                        `
                    }
                >
                    <div className={css`
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        padding: 0 20px;
                    `}>
                        <div className="quillforms-qr-share-modal">
                            <p>{__('Simply scan the code to initiate your Quill Forms, which function seamlessly both online and offline (printer required naturally).', 'quillforms')}
                            </p>
                            <p className={css`
                                background: #ffaef7;
                                padding: 5px 10px;
                                border-radius: 5px;
                            `}>{__('Changing the slug of your form within the builder will result in a corresponding alteration of the QR code.', 'quillforms')}
                            </p>
                            <div className={css`
                                text-align: center;
                                display: flex;
                                flex-direction: column;
                                align-items: center;
                                margin-top: 40px;
                            `}>
                                <QRCode value={payload?.link} />
                                <Button className={css`
                                    margin-top: 20px;
                                `} isPrimary isLarge onClick={() => downloadQR()}>{__('Download', 'quillforms')}</Button>

                            </div>

                        </div>
                    </div>
                </Modal >
            )}
        </div>
    )
};

export default ShareBody;
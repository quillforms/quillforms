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

const ShareBody = ({ payload }) => {

    const [modalState, setModalState] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [popupSettings, setPopupSettings] = useState({
        Title: 'Open Form',
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
    });

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

    const { hiddenFields } = useSelect((select) => {
        return {
            hiddenFields:
                select(
                    'quillForms/hidden-fields-editor'
                    //@ts-expect-error
                )?.getHiddenFields() ?? [],
        };
    });

    return (
        <div className="quillforms-share-page">
            <div className="quillforms-share-page-header">
                <ShareIcon />
                <div className="quillforms-share-page-heading">
                    <p>Share Your Form with Others using Multiple Options </p>
                    <p>
                        To share your form with others, you have several options available. You can share it via a direct link, shortcode, embed code, or pop-up. Choose the method that best suits your needs and preferences to ensure easy and convenient access for your audience.
                    </p>
                </div>
            </div>
            <div className="quillforms-share-page-body">
                <div className="quillforms-share-card" onClick={() => {
                    setModalState('link');
                }}>
                    <div className="quillforms-share-card-header">
                        <LinkIcon />
                        <h3>Direct Link</h3>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>Copy the form link and share it with your audience.</p>
                    </div>
                </div>
                <div className="quillforms-share-card" onClick={() => {
                    setModalState('shortcode');
                }}>
                    <div className="quillforms-share-card-header">
                        <h3 style={{
                            marginTop: 0,
                            fontSize: "22px",
                            marginBottom: "34px"
                        }}>[ / ]</h3>
                        <h3>Shortcode</h3>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>Copy the shortcode and paste it into your post or page.</p>
                    </div>
                </div>
                <div className="quillforms-share-card" onClick={() => {
                    setModalState('embed');
                }}>
                    <div className="quillforms-share-card-header">
                        <CodeIcon />
                        <h3>Embed Code</h3>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>Embed code is useful to share the form in an external web page. Copy the code and paste it into your external post or page.</p>
                    </div>
                </div>
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
                                <h3>Popup</h3>
                            </div>
                            <div className="admin-components-control-label__new-feature">
                                NEW
                            </div>
                        </div>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>Display your form on a popup upon clicking a desinated button. Copy the shortcode and paste it into your post or page.</p>
                    </div>
                </div>
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
                                <h3>QR Code</h3>
                            </div>
                            <div className="admin-components-control-label__new-feature">
                                NEW
                            </div>
                        </div>
                    </div>
                    <div className="quillforms-share-card-body">
                        <p>Share your form with others by scanning the QR code.</p>
                    </div>
                </div>
            </div>
            {modalState === 'link' && (
                <Modal
                    title="Direct Link"
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                >
                    <div className="quillforms-share-modal">
                        <p>Copy the link below and share it with your audience.</p>
                        <div className="quillforms-share-modal-link">
                            <input type="text" style={{ minWidth: "400px" }} value={payload?.link} readOnly />
                            {isCopied ? (
                                <Button isPrimary>Copied!</Button>
                            ) : (

                                <Button isPrimary onClick={() => {
                                    navigator.clipboard.writeText(payload?.link);
                                    setIsCopied(true);
                                }}>Copy</Button>
                            )}
                        </div>
                        <p> Please note that you can customize the slug from the builder on settings panel.</p>
                    </div>
                </Modal>
            )}

            {modalState === 'shortcode' && (
                <Modal
                    title="Shortcode"
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                >
                    <div className="quillforms-share-modal">
                        <p>Copy the shortcode below and insert it in your WordPress page or post.</p>
                        <div className="quillforms-share-modal-link">
                            <input type="text" style={{ minWidth: "400px" }} value={`[quillforms id="${payload?.id}" width="100%" ]`} readOnly />
                            {isCopied ? (
                                <Button isPrimary>Copied!</Button>
                            ) : (

                                <Button isPrimary onClick={() => {
                                    navigator.clipboard.writeText(`[quillforms id="${payload?.id}" width="100%" ]`);
                                    setIsCopied(true);
                                }}>Copy</Button>
                            )}
                        </div>
                    </div>
                </Modal>
            )
            }
            {modalState === 'embed' && (
                <Modal
                    title="Embed Code"
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                >
                    <div className="quillforms-share-modal">
                        <p>Copy the embed code below and insert it in your external page.</p>
                        <div className="quillforms-share-modal-link">
                            <input type="text" style={{ minWidth: "400px" }}
                                value={`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`} readOnly />
                            {isCopied ? (
                                <Button isPrimary>Copied!</Button>
                            ) : (

                                <Button isPrimary onClick={() => {
                                    navigator.clipboard.writeText(`<iframe src="${payload.link}" width="100%" height="600" style="border:0;"></iframe>`);
                                    setIsCopied(true);
                                }}>Copy</Button>
                            )}
                        </div>
                    </div>
                </Modal >
            )
            }

            {modalState === 'popup' && (
                <Modal
                    title="Popup"
                    onRequestClose={() => {
                        setModalState(false);
                    }}
                    className={
                        css`
                            width: 100%;
                            height: 100%;
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
                                <h3>Popup Settings</h3>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>Button title</label>
                                    <input type="text" value={popupSettings.buttonTitle} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonTitle: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>Button background color</label>
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
                                    <label>Button text color</label>
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
                                    <label>Button border radius(px)</label>
                                    <input type="number" value={popupSettings.buttonBorderRadius} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonBorderRadius: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>Button border width(px)</label>
                                    <input type="number" value={popupSettings.buttonBorderWidth} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonBorderWidth: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>Button border color</label>
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
                                    <label>Button font size(px)</label>
                                    <input type="number" value={popupSettings.buttonFontSize} onChange={(e) => {
                                        setPopupSettings({
                                            ...popupSettings,
                                            buttonFontSize: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className="quillforms-share-popup-settings-row">
                                    <label>Button padding(px)</label>
                                    <div className="quillforms-share-popup-settings-row-padding-group">
                                        <div>
                                            <span>Top</span>
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
                                            <span>Right</span>
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
                                            <span>Bottom</span>
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
                                            <span>Left</span>

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
                            </div>
                            <div className={css`
                                position: fixed;
                                right: 318px;
                                top: 100px;
                            `}>
                                <h3>Preview</h3>
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
                                <p>Copy the shortcode below and insert it in your WordPress page or post.</p>
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
                                    <Button isPrimary>Copied!</Button>
                                ) : (

                                    <Button isPrimary onClick={() => {
                                        navigator.clipboard.writeText(`${popupShortcode}`);
                                        setIsCopied(true);
                                    }}>Copy</Button>
                                )}
                            </div>
                        </div>


                    </div>
                </Modal >
            )
            }

            {modalState === 'qr' && (
                <Modal
                    title="QR Code"
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
                            <p>Simply scan the code to initiate your Quill Forms, which function seamlessly both online and offline (printer required naturally).
                            </p>
                            <p className={css`
                                background: #ffaef7;
                                padding: 5px 10px;
                                border-radius: 5px;
                            `}>Changing the slug of your form within the builder will result in a corresponding alteration of the QR code.
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
                                `} isPrimary isLarge onClick={() => downloadQR()}>Download</Button>

                            </div>

                        </div>
                    </div>
                </Modal >
            )}
        </div>
    )
};

export default ShareBody;
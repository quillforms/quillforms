/**
 * QuillForms Dependencies
 */
import {
  Button,
  HTMLParser,
  useTheme,
  useMessages,
  useFormContext,
} from "@quillforms/renderer-core";

/**
 * WordPress Dependencies
 */
import { useState, useRef, useEffect, render } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { autop } from "@wordpress/autop";

/**
 * External Dependencies
 */
import { noop } from "lodash";
import { css } from "emotion";
import classNames from "classnames";

/**
 * Internal Dependencies
 */
import Attachment from "./attachment";

// Add this function at the top of your component
const getAlignmentStyles = (align) => {
  switch (align) {
    case 'left':
      return {
        textAlign: 'left',
        alignItems: 'flex-start',
      };
    case 'right':
      return {
        textAlign: 'right',
        alignItems: 'flex-end',
      };
    case 'center':
    default:
      return {
        textAlign: 'center',
        alignItems: 'center',
      };
  }
};

let timer;
const ThankyoucreenDisplay = ({ attributes }) => {
  const { isPreview, deviceWidth, editor } = useFormContext();
  const [isActive, setIsActive] = useState(false);
  const {
    redirectUrl,
    redirectOnSameWindow,
    autoRedirect,
    autoRedirectUrl,
    autoRedirectLag,
  } = attributes;
  let label = "...";
  if (attributes?.label) label = attributes.label;
  const theme = useTheme();
  const screenWrapperRef = useRef();
  const screenContentRef = useRef();

  // Get alignment value from attributes
  const align = attributes?.align ?? 'center';
  const alignmentStyles = getAlignmentStyles(align);

  const { resetAnswers, goToBlock } = useDispatch("quillForms/renderer-core");
  const { walkPath } = useSelect((select) => {
    return {
      walkPath: select("quillForms/renderer-core").getWalkPath(),
    };
  });

  const parseRedirectUrl = async (url) => {
    const span = document.createElement("span");
    render(<HTMLParser value={url} />, span);
    var tmp = document.createElement("div");
    tmp.appendChild(span);

    await new Promise((r) => setTimeout(r));
    return tmp.children[0].innerText;
  };

  const isTopAccessible = () => {
    try {
      // @ts-ignore
      window.top.location;
      return true;
    } catch (err) {
      return false;
    }
  };

  const isInIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      // If we can't access window.top, we're definitely in a cross-origin iframe
      return true;
    }
  };

  const isQuillFormsDomain = () => {
    try {
      const hostname = window.location.hostname;
      return hostname === 'quillforms.app' || hostname.endsWith('.quillforms.app');
    } catch (e) {
      return false;
    }
  };

  const sendRedirectMessage = (url, newTab = false) => {
    // Send message to parent window for cross-origin iframe redirect
    const message = {
      type: 'quillforms-redirect',
      url: url,
      newTab: newTab,
    };
    // Post to parent - the embed script will handle this
    window.parent.postMessage(message, '*');
  };

  const redirect = async (url, sameWindow = true) => {
    // parse.
    url = await parseRedirectUrl(url);

    // redirect according to
    const ParsedUrlSearch = new URLSearchParams(
      window.location.search.substring(1)
    );
    // 'quillforms-redirection' is deprecated and will be removed.
    if (
      (ParsedUrlSearch.get("quillforms-shortcode") ||
        ParsedUrlSearch.get("quillforms-redirection") === "top") &&
      isTopAccessible()
    ) {
      if (sameWindow) {
        window.top.location.href = url;
      } else {
        window.open(url, "_blank").focus();
      }
    } else if (isInIframe() && !isTopAccessible()) {
      // Cross-origin iframe
      if (isQuillFormsDomain()) {
        // Only use postMessage for quillforms.app domain
        // The embed script on the parent page will handle the redirect
        sendRedirectMessage(url, !sameWindow);
      } else {
        // For non-quillforms.app domains, redirect the current window (iframe)
        if (sameWindow) {
          window.location.href = url;
        } else {
          window.open(url, "_blank").focus();
        }
      }
    } else {
      if (sameWindow) {
        window.location.href = url;
      } else {
        window.open(url, "_blank").focus();
      }
    }
  };

  useEffect(() => {
    setIsActive(true);
    if (!isPreview && editor?.mode === 'off' && autoRedirect && autoRedirectUrl) {
      timer = setTimeout(() => {
        redirect(autoRedirectUrl);
      }, autoRedirectLag * 1000);
    }
    return () => setIsActive(false);
  }, []);

  let next = noop;
  if (walkPath[0] && walkPath[0].id) {
    next = () => {
      resetAnswers();
      goToBlock(walkPath[0].id);
    };
  }

  return (
    <div
      className={css`
        height: 100%;
        position: relative;
        outline: none;
      `}
      ref={screenWrapperRef}
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.key === "Enter" && editor?.mode === 'off') {
          e.stopPropagation();
          next();
        }
      }}
    >
      <div
        className={classNames("qf-thankyou-screen-block__wrapper",
          `blocktype-thankyou-screen-block`,
          `renderer-core-block-${attributes?.layout}-layout`,
          {
            active: isActive,
          },
          css`
						& {
							position: absolute;
							top: 0;
							left: 0;
							right: 0;
							bottom: 0;
							z-index: 6;
							display: flex;
							${(attributes.layout === 'stack' ||
              (deviceWidth === 'mobile' &&
                (attributes.layout === 'float-left' ||
                  attributes.layout ===
                  'float-right'))) &&
            `flex-direction: column;
							.qf-thankyou-screen-block__content-wrapper {
                  position: relative;
                  top: 0;
                  right: 0;
                  left: 0;
							}` }
							justify-content: center;
							width: 100%;
							height: 100%;
              max-height: 100%;
							overflow-y: auto;
							opacity: 0;
							visibility: hidden;
							transition: all 0.4s ease-in-out;
							-webkit-transition: all 0.4s ease-in-out;
							-moz-transition: all 0.4s ease-in-out;
						}

						&.active {
							opacity: 1;
							visibility: visible;
						}

						.qf-thankyou-screen-block__content-wrapper {
							display: flex;
							flex-direction: column;
							justify-content: center;
							/* Apply alignment styles */
							align-items: ${alignmentStyles.alignItems};
							text-align: ${alignmentStyles.textAlign};
							max-width: 700px;
							padding: 30px;
							word-wrap: break-word;
							margin-right: auto;
							margin-left: auto;
							width: 100%;
						}
						
						.qf-thankyou-screen-block__content {
						  width: 100%;
						  display: flex;
						  flex-direction: column;
						  /* Apply alignment to content container */
						  align-items: ${alignmentStyles.alignItems};
						}
						
						.renderer-components-block-label,
						.renderer-components-block-description,
						.renderer-components-block-custom-html {
						  width: 100%;
						  /* Inherit text alignment */
						  text-align: inherit;
						}

						&.active.has-scroll {
							.qf-thankyou-screen-block__content-wrapper {
								margin: auto;
								width: 100%;
								max-width: 700px;
							}
						}
					`)}
      >
        <div className={'qf-thankyou-screen-block__content-wrapper'}>
          <div
            className="qf-thankyou-screen-block__content"
            ref={screenContentRef}
          >
            {(attributes.layout === 'stack' ||
              (deviceWidth === 'mobile' &&
                (attributes.layout === 'float-left' ||
                  attributes.layout ===
                  'float-right'))) && (
                <Attachment
                  isPreview={isPreview || editor?.mode === 'on'}
                  attributes={attributes}
                />
              )}
            <div
              className={css`
								margin-top: 25px;
								width: 100%;
								/* Ensure content follows the alignment */
								text-align: inherit;
							`}
            >
              <div
                className={classNames(
                  "renderer-components-block-label",
                  css`
                    color: ${theme.questionsColor};
                    /* Inherit text alignment */
                    text-align: inherit;
                  `
                )}
              >
                {editor?.mode === 'on' ? <editor.editLabel /> : <HTMLParser value={attributes?.label ?? ''} />}
              </div>
              {attributes?.description && attributes.description !== "" && (
                <div
                  className={classNames(
                    "renderer-components-block-description",
                    css`
                      color: ${theme.questionsColor};
                      /* Inherit text alignment */
                      text-align: inherit;
                    `
                  )}
                >
                  {editor.mode === 'on' ? <editor.editDescription /> : <HTMLParser value={attributes.description ?? ""} />}
                </div>
              )}
            </div>
          </div>
          {attributes?.customHTML && (
            <div
              className={classNames(
                "renderer-components-block-custom-html",
                css`
                  color: ${theme.questionsColor};
                  width: 100%;
                  /* Inherit text alignment */
                  text-align: inherit;
                `
              )}
              dangerouslySetInnerHTML={{
                __html: attributes?.customHTML,
              }}
            ></div>
          )}
          {attributes.showButton && (
            <ScreenAction
              buttonText={attributes.buttonText}
              align={align} // Pass alignment to ScreenAction
              next={() => {
                if (isPreview || editor.mode === 'on') return;
                clearTimeout(timer);
                if (attributes.buttonMode === "reload") {
                  next();
                } else {
                  if (redirectUrl) {
                    redirect(redirectUrl, redirectOnSameWindow);
                  }
                }
              }}
            />
          )}
        </div>
        {((attributes.layout !== 'stack' &&
          deviceWidth !== 'mobile') ||
          (deviceWidth === 'mobile' &&
            (attributes.layout === 'split-left' ||
              attributes.layout === 'split-right'))) && (
            <div
              className={classNames(
                'renderer-core-block-attachment-wrapper',
                css`
								img {
									object-position: ${
                  // @ts-expect-error
                  attributes?.attachmentFocalPoint
                    ?.x * 100
                  }%
										${
                  // @ts-expect-error
                  attributes?.attachmentFocalPoint
                    ?.y * 100
                  }%;
								}
							`
              )}
            >
              <Attachment
                isPreview={isPreview || editor?.mode === 'on'}
                attributes={attributes}
              />
            </div>
          )}
      </div>
    </div>
  );
};

// Updated ScreenAction component to support alignment
const ScreenAction = ({ isSticky, buttonText, next, align = 'center' }) => {
  const messages = useMessages();
  const theme = useTheme();
  const isTouchScreen =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  const getActionAlignment = (align) => {
    switch (align) {
      case 'left':
        return 'flex-start';
      case 'right':
        return 'flex-end';
      case 'center':
      default:
        return 'center';
    }
  };

  return (
    <div
      className={classNames("qf-thankyou-screen-block__action-wrapper", {
        "is-sticky": isSticky,
      }, css`
        display: flex;
        flex-direction: column;
        justify-content: ${getActionAlignment(align)};
        align-items: ${getActionAlignment(align)};
        margin-top: 20px;
        width: 100%;
        text-align: ${align};
      `)}
    >
      <div
        className={classNames(
          "qf-thankyou-screen-block__action",
          css`
            width: 100%;
            text-align: ${align};
          `
        )}
      >
        <Button onClick={next}> {buttonText} </Button>
      </div>

      <div
        className={classNames(
          "qf-thankyou-screen-block__action-helper-text",
          css`
            color: ${theme.questionsColor};
            width: 100%;
            text-align: ${align};
            margin-top: 8px;
          `
        )}
      >
        {!isTouchScreen && (
          <HTMLParser value={messages["label.hintText.enter"]} />
        )}
      </div>
    </div>
  );
};

export default ThankyoucreenDisplay;
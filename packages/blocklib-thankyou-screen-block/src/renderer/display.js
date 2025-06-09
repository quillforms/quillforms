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

  const { resetAnswers, goToBlock } = useDispatch("quillForms/renderer-core");
  const { walkPath } = useSelect((select) => {
    return {
      walkPath: select("quillForms/renderer-core").getWalkPath(),
    };
  });

  // useLayoutEffect( () => {
  // 	if (
  // 		screenContentRef.current.clientHeight + 150 >
  // 		screenWrapperRef.current.clientHeight
  // 	) {
  // 		setStickyFooter( true );
  // 	} else {
  // 		setStickyFooter( false );
  // 	}
  // } );

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
							align-items: center;
							max-width: 700px;
							padding: 30px;
							word-wrap: break-word;
							text-align: center;
							margin-right: auto;
							margin-left: auto;
							width: 100%;
						}
						
						.qf-thankyou-screen-block__content {
						  width: 100%;
						  display: flex;
						  flex-direction: column;
						  align-items: center;
						}
						
						.renderer-components-block-label,
						.renderer-components-block-description,
						.renderer-components-block-custom-html {
						  width: 100%;
						  text-align: center;
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
							`}
            >
              <div
                className={classNames(
                  "renderer-components-block-label",
                  css`
                    color: ${theme.questionsColor};
                  `
                )}
              >
                {editor?.mode === 'on' ? <editor.editLabel /> : <HTMLParser value={autop(label)} />}
              </div>
              {attributes?.description && attributes.description !== "" && (
                <div
                  className={classNames(
                    "renderer-components-block-description",
                    css`
                      color: ${theme.questionsColor};
                    `
                  )}
                >
                  {editor.mode === 'on' ? <editor.editDescription /> : <HTMLParser value={autop(attributes.description)} />}
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

const ScreenAction = ({ isSticky, buttonText, next }) => {
  const messages = useMessages();
  const theme = useTheme();
  const isTouchScreen =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  return (
    <div
      className={classNames("qf-thankyou-screen-block__action-wrapper", {
        "is-sticky": isSticky,
      }, css`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        width: 100%;
      `)}
    >
      <div className="qf-thankyou-screen-block__action">
        <Button onClick={next}> {buttonText} </Button>
      </div>

      <div
        className={classNames(
          "qf-thankyou-screen-block__action-helper-text",
          css`
            color: ${theme.questionsColor};
            text-align: center;
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
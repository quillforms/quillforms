import ConfigAPI from '@quillforms/config';
import { useState } from '@wordpress/element';
import { Icon, Modal } from "@wordpress/components"
import { Button, ProLabel, __experimentalFeatureAvailability } from "@quillforms/admin-components";
import { getHistory, getNewPath, NavLink } from '@quillforms/navigation';
import apiFetch from '@wordpress/api-fetch';
import { map, size } from "lodash";
import { css } from "emotion";
import classnames from 'classnames';
const ChooseTemplate = () => {
    const formTemplates = ConfigAPI.getFormTemplates();
    const [chosenTemplate, setChosenTemplate] = useState(null);
    const license = ConfigAPI.getLicense();
    const [displayProModal, setDisplayProModal] = useState(false);
    const [requiredAddons, setRequiredAddons] = useState([]);
    const StoreAddons = ConfigAPI.getStoreAddons();

    return (
        <>
            {chosenTemplate ? (
                <div className="chosen-template">
                    <div className='chosen-template__back' onClick={() => {
                        setChosenTemplate(null);
                    }}>

                        <Icon icon="arrow-left" />
                        <span>Back to template selection</span>
                    </div>
                    <div className="chosen-template__header">

                        <h2>{formTemplates[chosenTemplate].title}</h2>
                        {size(formTemplates[chosenTemplate]?.notes) > 0 && (
                            <div className="chosen-template__notes">
                                {formTemplates[chosenTemplate]?.notes}
                            </div>
                        )}
                        <Button isPrimary isButton isLarge onClick={() => {
                            let $requiredAddons = [];

                            if (size(formTemplates[chosenTemplate]?.required_addons) > 0) {
                                map(formTemplates[chosenTemplate]?.required_addons, (addon) => {
                                    if (!StoreAddons[addon]?.is_installed || !StoreAddons[addon]?.is_active) {
                                        $requiredAddons.push(addon);
                                    }
                                })
                            }

                            if (size($requiredAddons) > 0) {
                                setRequiredAddons($requiredAddons);
                                return;
                            }


                            let data = {}
                            data['title'] = formTemplates[chosenTemplate].title;
                            data['blocks'] = formTemplates[chosenTemplate].data.blocks;
                            if (formTemplates[chosenTemplate].data.settings) {
                                data = {
                                    ...data,
                                    settings: formTemplates[chosenTemplate].data.settings
                                }
                            }
                            if (formTemplates[chosenTemplate].data.payments) {
                                data = {
                                    ...data,
                                    payments: formTemplates[chosenTemplate].data.payments
                                }
                            }

                            if (formTemplates[chosenTemplate].data.logic) {
                                data = {
                                    ...data,
                                    logic: formTemplates[chosenTemplate].data.logic
                                }
                            }

                            if (formTemplates[chosenTemplate].data.quiz) {
                                data = {
                                    ...data,
                                    quiz: formTemplates[chosenTemplate].data.quiz
                                }
                            }

                            if (formTemplates[chosenTemplate].data.products) {
                                data = {
                                    ...data,
                                    products: formTemplates[chosenTemplate].data.products
                                }
                            }
                            apiFetch({
                                path: '/wp/v2/quill_forms',
                                method: 'POST',
                                data,
                            }).then((res) => {
                                const { id } = res;
                                getHistory().push(getNewPath({}, `/forms/${id}/builder`));
                            });

                        }
                        }>
                            Use this template
                        </Button>
                    </div>
                    <div className="chosen-template__preview">
                        <iframe
                            title={formTemplates[chosenTemplate].title} src={formTemplates[chosenTemplate].link} height="100%" width="100%" />
                    </div>
                    <>
                        {displayProModal && (
                            <Modal
                                className={classnames(
                                    css`
										border: none !important;
										border-radius: 9px;

										.components-modal__header {
											background: linear-gradient(
												42deg,
												rgb( 235 54 221 ),
												rgb( 238 142 22 )
											);
											h1 {
												color: #fff;
											}
											svg {
												fill: #fff;
											}
										}
										.components-modal__content {
											text-align: center;
										}
									`
                                )}
                                title={`${formTemplates[chosenTemplate].title} requires pro license`}

                                onRequestClose={() => {
                                    setDisplayProModal(false);
                                }}
                            >
                                <__experimentalFeatureAvailability
                                    featureName={formTemplates[chosenTemplate].title + " template"}
                                    planKey="basic"
                                    showLockIcon={true}
                                />
                            </Modal>
                        )}

                        {size(requiredAddons) > 0 && (
                            <Modal
                                className={classnames(
                                    css`
                                        border: none !important;
                                        border-radius: 9px;
                                        
                                `)}
                                onRequestClose={() => {
                                    setRequiredAddons([]);
                                }}
                                title={`Required Addons`}
                            >
                                <div>
                                    <p>
                                        This template requires the following addons to be installed and activated:
                                    </p>
                                    <ul>
                                        {map(requiredAddons, (addon) => {
                                            return (
                                                <li className={css`
                                                    display: flex;
                                                    justify-content: space-between;
                                                    align-items: center;
                                                    padding: 10px;
                                                    border: 1px solid rgb(227, 227, 227);
                                                    border-radius: 4px;
                                                    margin-bottom: 10px;
                                                `}>
                                                    <span>
                                                        {StoreAddons[addon]?.name}
                                                    </span>
                                                    <Button
                                                        isPrimary
                                                        isButton
                                                        className={css`
                                                            padding: 0 !important;
                                                            background-color: #1e87f0;

                                                            a {
                                                                text-decoration: none;
                                                                color: #fff;
                                                                padding: 2px 8px;
                                                                background-color: #1e87f0;
                                                            }
											        ` }
                                                    >
                                                        <NavLink
                                                            to={`/admin.php?page=quillforms&path=addons`}
                                                        >
                                                            Install
                                                        </NavLink>
                                                    </Button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </Modal>
                        )}
                    </>
                </div>
            ) : (
                <div className="choose-template">
                    <div className="choose-template__header">
                        <h2>Choose a template</h2>
                        <p>
                            Start with a template to save time and be more productive.
                        </p>
                    </div>
                    <div className="choose-template__cards">
                        {Object.keys(formTemplates).map((templateName) => {
                            const template = formTemplates[templateName];
                            return (
                                <div
                                    className="choose-template__card"
                                    onClick={() => {
                                        setChosenTemplate(templateName);
                                    }}
                                >

                                    <div className="choose-template__card__image">
                                        <img src={template.screenshot} alt={template.name} />
                                    </div>
                                    <div className="choose-template__card__content">
                                        <h3>{template.title} {size(formTemplates[templateName]?.required_addons) > 0 && license?.status !== 'valid' && (
                                            <ProLabel />
                                        )}</h3>
                                    </div>

                                </div>
                            )
                        })}
                    </div>


                </div>
            )}
        </>
    )
}

export default ChooseTemplate;
/**
 * QuillForms Dependencies.
 */
import {
    SelectControl,
    Button,
    BaseControl,
    ControlLabel,
    ControlWrapper,
    ToggleControl,
    TextControl,
    __experimentalFeatureAvailability,
} from '@quillforms/admin-components';
import { setForceReload } from '@quillforms/navigation';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { Modal } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

/**
 * External Dependencies
 */
import { css } from 'emotion';
import classnames from 'classnames';
import { ThreeDots as Loader } from 'react-loader-spinner';


const Geolocation = () => {

    const [settings, setSettings] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const { createErrorNotice, createSuccessNotice } =
        useDispatch('core/notices');

    const setSettingField = (key, value) => {
        setSettings((settings) => {
            return {
                ...settings,
                [key]: value,
            };
        });
    };

    useEffect(() => {
        apiFetch({
            path: `/qf/v1/settings?groups=geolocation`,
            method: 'GET',
        })
            .then((res) => {
                console.log(res);
                setSettings(res.geolocation);
            })
            .catch(() => {
                setSettings(false);
            });
    }, []);

    const save = () => {
        setIsSaving(true);
        apiFetch({
            path: `/qf/v1/settings`,
            method: 'POST',
            data: settings,
        })
            .then(() => {
                createSuccessNotice('✅ Settings saved', {
                    type: 'snackbar',
                    isDismissible: true,
                });
                setIsSaving(false);
                // To reinitialize google maps scripts
                setForceReload(true);
            })
            .catch((err) => {
                createErrorNotice(`⛔ ${err ?? 'Error'}`, {
                    type: 'snackbar',
                    isDismissible: true,
                });
                setIsSaving(false);
            });
    };

    return (
        <div className='quillforms-geolocation-settings-tab'>
            {settings === null ? (
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
            ) : !settings ? (
                <div className="error">Cannot load settings</div>
            ) : (
                <div>
                    <BaseControl>
                        <ControlWrapper orientation="vertical">
                            <ControlLabel label="Google Maps api key"></ControlLabel>
                            <TextControl
                                value={settings.google_maps_api_key}
                                onChange={(value) => {
                                    setSettingField(
                                        'google_maps_api_key',
                                        value
                                    );
                                }}
                            />
                            <p
                                className={css`
                                        background: rgb( 246 246 246 );
                                        padding: 12px;
                                        border-radius: 10px;
                                    ` }
                            >
                                To get your API key <br />
                                1-{' '}
                                <a href="https://developers.google.com/maps/documentation/javascript/places#enable_apis">
                                    Enable GoogleMaps Places API.
                                </a>
                                <br />
                                2-{' '}
                                <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">
                                    Get an API key.
                                </a>
                                <br />
                            </p>
                        </ControlWrapper>
                    </BaseControl>
                    <div
                        className={css`
                                text-align: left;
                                margin-top: 20px;
                            ` }
                    >
                        {isSaving ? (
                            <Button isLarge isSecondary>
                                Saving
                            </Button>
                        ) : (
                            <Button isLarge isPrimary onClick={save}>
                                Save
                            </Button>
                        )}
                    </div>

                </div>
            )}
        </div>

    );
}
export default Geolocation;

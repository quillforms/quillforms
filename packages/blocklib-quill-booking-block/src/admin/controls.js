/**
 * QuillForms Dependencies
 */
import {
    BaseControl,
    ControlWrapper,
    ControlLabel,
    TextControl,
    ComboboxControl,
    SelectControl,
} from '@quillforms/admin-components';
import ConfigAPI from '@quillforms/config';

/**
 * WordPress Dependencies
 */
import { Fragment, useState, useEffect } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

const Controls = (props) => {
    const {
        id,
        attributes: {
            eventId,
            username,
            email,
            scheduleText,
            alreadyScheduledText,
        },
        setAttributes,
    } = props;

    const [eventOptions, setEventOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pluginStatus, setPluginStatus] = useState('checking'); // 'checking', 'active', 'inactive', 'not_installed', 'no_permission'

    const {
        setFieldAnswer,
        setIsFieldAnswered,
        setIsFieldValid,
        setFieldValidationErr,
    } = useDispatch('quillForms/renderer-core');

    // Check if QuillBooking plugin is active and fetch events
    useEffect(() => {
        const checkPluginAndFetchEvents = async () => {
            let currentStatus = 'checking';

            try {
                setLoading(true);

                // Method 1: Check using WordPress plugins API
                try {
                    const pluginsResponse = await apiFetch({
                        path: 'wp/v2/plugins',
                    });

                    // Look for QuillBooking plugin in the installed plugins
                    const quillBookingPlugin = pluginsResponse.find(plugin =>
                        plugin.plugin && (
                            plugin.plugin.includes('quillbooking') ||
                            plugin.name.toLowerCase().includes('quillbooking')
                        )
                    );

                    if (!quillBookingPlugin) {
                        currentStatus = 'not_installed';
                        setPluginStatus(currentStatus);
                        throw new Error('Plugin not installed');
                    }

                    if (quillBookingPlugin.status !== 'active') {
                        currentStatus = 'inactive';
                        setPluginStatus(currentStatus);
                        throw new Error('Plugin not active');
                    }

                    currentStatus = 'active';
                    setPluginStatus(currentStatus);

                } catch (pluginsError) {
                    // If we already determined the plugin status from the plugins API, don't override it
                    if (currentStatus !== 'checking') {
                        throw pluginsError; // Plugin is installed but not active, don't try fallback
                    }

                    // Method 2: Fallback - Check if QuillBooking endpoints exist directly
                    try {
                        await apiFetch({
                            path: 'qb/v1/events?per_page=1',
                        });
                        currentStatus = 'active';
                        setPluginStatus(currentStatus);
                    } catch (fallbackError) {
                        throw fallbackError; // Re-throw to be handled by outer catch
                    }
                }

                // If plugin is active, fetch all events
                const response = await apiFetch({
                    path: 'qb/v1/events?per_page=100&filter[user]=all',
                });

                // Process events for SelectControl format
                const options = [];

                if (response && response.data) {
                    // Add default option
                    options.push({
                        key: '',
                        name: __('Select an event', 'quillforms'),
                    });

                    // Group events by calendar host name (now calendar data is included)
                    const eventsByCalendar = {};
                    response.data.forEach(event => {
                        const calendarName = event.calendar ? event.calendar.name : `Calendar ${event.calendar_id}`;
                        if (!eventsByCalendar[calendarName]) {
                            eventsByCalendar[calendarName] = [];
                        }
                        eventsByCalendar[calendarName].push({
                            key: event.id.toString(),
                            name: event.name,
                        });
                    });

                    // Add sections and options
                    Object.keys(eventsByCalendar).forEach(calendarName => {
                        // Add section header
                        options.push({
                            key: `section-${calendarName}`,
                            name: (
                                <div onClick={(ev) => ev.stopPropagation()} style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                                    {calendarName}
                                </div>
                            ),
                            className: 'event-select-section',
                        });

                        // Add events under this calendar
                        eventsByCalendar[calendarName].forEach(event => {
                            options.push({
                                key: event.key,
                                name: (
                                    <div style={{ paddingLeft: '15px' }}>
                                        {event.name}
                                    </div>
                                ),
                            });
                        });
                    });
                }

                // If no events were found, show appropriate message
                if (options.length === 1) { // Only the default "Select an event" option
                    options.push({
                        key: 'no-events',
                        name: (
                            <div style={{ padding: '10px', textAlign: 'center', color: '#666', pointerEvents: 'none' }}>
                                <div>{__('No calendars or events found', 'quillforms')}</div>
                                <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                    <a
                                        href="#"
                                        style={{ color: '#007cba', textDecoration: 'underline', cursor: 'pointer', pointerEvents: 'auto' }}
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            window.open(`${ConfigAPI.getAdminUrl()}admin.php?page=quillbooking&path=calendars`, '_blank');
                                        }}
                                    >
                                        {__('Create calendar and event', 'quillforms')}
                                    </a>
                                </div>
                            </div>
                        ),
                        disabled: true,
                        selectable: false,
                    });
                }

                setEventOptions(options);
            } catch (error) {

                // Determine specific error type for better user feedback
                let status = currentStatus === 'checking' ? 'inactive' : currentStatus;
                let errorMessage = __('QuillBooking plugin is not active', 'quillforms');
                let actionText = __('Go to Plugins', 'quillforms');
                let actionUrl = `${ConfigAPI.getAdminUrl()}plugins.php`;

                if (error.code === 'rest_no_route' || currentStatus === 'not_installed') {
                    status = 'not_installed';
                    errorMessage = __('QuillBooking plugin is not installed', 'quillforms');
                    actionText = __('Install QuillBooking Plugin', 'quillforms');
                    actionUrl = `${ConfigAPI.getAdminUrl()}plugin-install.php?s=quillbooking&tab=search&type=term`;
                } else if (error.code === 'rest_cannot_access' || error.code === 'rest_forbidden') {
                    status = 'no_permission';
                    errorMessage = __('No permission to access QuillBooking API', 'quillforms');
                    actionText = __('Check Permissions', 'quillforms');
                    actionUrl = `${ConfigAPI.getAdminUrl()}users.php`;
                } else if (error.code === 'rest_cookie_invalid_nonce' || error.code === 'rest_not_logged_in') {
                    status = 'no_permission';
                    errorMessage = __('Authentication required for QuillBooking API', 'quillforms');
                    actionText = __('Refresh Page', 'quillforms');
                    actionUrl = window.location.href;
                } else if (currentStatus === 'inactive') {
                    status = 'inactive';
                    errorMessage = __('QuillBooking plugin is not active', 'quillforms');
                    actionText = __('Go to Plugins', 'quillforms');
                    actionUrl = `${ConfigAPI.getAdminUrl()}plugins.php`;
                }

                currentStatus = status;
                setPluginStatus(status);
                setEventOptions([
                    { key: '', name: __('Select an event', 'quillforms') },
                    {
                        key: `plugin-${status}`,
                        name: (
                            <div style={{ padding: '10px', textAlign: 'center', color: '#d63638', pointerEvents: 'none' }}>
                                <div>{errorMessage}</div>
                                <div style={{ marginTop: '5px', fontSize: '12px' }}>
                                    <a
                                        href="#"
                                        style={{ color: '#007cba', textDecoration: 'underline', cursor: 'pointer', pointerEvents: 'auto' }}
                                        onClick={(ev) => {
                                            ev.preventDefault();
                                            ev.stopPropagation();
                                            window.open(actionUrl, '_blank');
                                        }}
                                    >
                                        {actionText}
                                    </a>
                                </div>
                            </div>
                        ),
                        disabled: true,
                        selectable: false,
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        checkPluginAndFetchEvents();
    }, []);

    const customize = ({ sections, options }) => {
        try {
            // Defensive checks to prevent null reference errors
            const safeSections = Array.isArray(sections) ? sections : [];
            const safeOptions = Array.isArray(options) ? options : [];

            const filteredSections = safeSections.filter((section) =>
                section && section.key && ['fields', 'hidden_fields'].includes(section.key)
            );
            const filteredOptions = safeOptions.filter((option) =>
                option && option.type && ['field', 'hidden_field'].includes(option.type)
            );

            return { sections: filteredSections, options: filteredOptions };
        } catch (error) {
            return { sections: [], options: [] };
        }
    };

    const resetField = () => {
        setFieldAnswer(id, null);
        setIsFieldValid(id, true);
        setIsFieldAnswered(id, false);
        setFieldValidationErr(id, null);
    };

    return (
        <Fragment>

            <BaseControl>
                <ControlWrapper orientation="vertical">
                    <ControlLabel label={__("Event", "quillforms")} />
                    <SelectControl
                        value={eventOptions.find(option => option.key === eventId) || eventOptions[0]}
                        onChange={({ selectedItem }) => {
                            if (selectedItem && selectedItem.key &&
                                !selectedItem.key.startsWith('section-') &&
                                selectedItem.key !== 'no-events' &&
                                selectedItem.key !== 'error' &&
                                !selectedItem.key.startsWith('plugin-')) {
                                resetField();
                                setAttributes({ eventId: selectedItem.key });
                            }
                        }}
                        options={eventOptions}
                    />
                </ControlWrapper>
            </BaseControl>

            <BaseControl>
                <ControlLabel label={__("Prefill info", "quillforms")} />
                <ControlWrapper orientation="vertical">
                    <ControlLabel label={__("Name", "quillforms")} />
                    <ComboboxControl
                        value={username}
                        onChange={(username) => {
                            resetField();
                            setAttributes({ username });
                        }}
                        customize={customize}
                        isToggleEnabled={false}
                    />
                </ControlWrapper>
                <ControlWrapper orientation="vertical">
                    <ControlLabel label={__("Email", "quillforms")} />
                    <ComboboxControl
                        value={email}
                        onChange={(email) => {
                            resetField();
                            setAttributes({ email });
                        }}
                        customize={customize}
                        isToggleEnabled={false}
                    />
                </ControlWrapper>
            </BaseControl>

            <BaseControl>
                <ControlWrapper orientation="vertical">
                    <ControlLabel label={__("Schedule button text in mobile", "quillforms")} />
                    <TextControl
                        value={scheduleText}
                        onChange={(scheduleText) => {
                            resetField();
                            setAttributes({ scheduleText });
                        }}
                    />
                </ControlWrapper>
            </BaseControl>

            <BaseControl>
                <ControlWrapper orientation="vertical">
                    <ControlLabel label={__("Already scheduled text in mobile", "quillforms")} />
                    <TextControl
                        value={alreadyScheduledText}
                        onChange={(alreadyScheduledText) => {
                            resetField();
                            setAttributes({ alreadyScheduledText });
                        }}
                    />
                </ControlWrapper>
            </BaseControl>

        </Fragment>
    );
};

export default Controls;
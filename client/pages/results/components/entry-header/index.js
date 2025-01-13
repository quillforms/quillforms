/**
 * QuillForms Dependencies
 */
import {
    SelectControl,
    BlockIconBox,
    Button,
} from '@quillforms/admin-components';
import ConfigAPI from "@quillforms/config";

/**
 * WordPress Dependencies
 */
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External Dependencies
 */
import { ThreeDots } from 'react-loader-spinner';
import { orderBy as _orderBy, size } from 'lodash';
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import PartialSubmissionBanner from '../partial-submission-banner';
import { useSelect } from '@wordpress/data';
const EntriesHeader = ({
    from,
    to,
    setFrom,
    setTo,
    filterEntriesByDate,
    selectedField,
    setSelectedField,
    orderBy,
    setOrderBy,
    order,
    setOrder,
    options,
    orderByOptions,
    orderOptions
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: from ? new Date(from) : new Date(),
            endDate: to ? new Date(to) : new Date(),
            key: 'selection'
        }
    ]);
    const doesPartialSubmissionPointExist = ConfigAPI.getInitialPayload()?.blocks?.some(
        (block) => block?.name === 'partial-submission-point'
    );

    const handleDatePickerClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDatePickerClose = () => {
        setAnchorEl(null);
    };

    const handleDateRangeChange = (ranges) => {
        setDateRange([ranges.selection]);
        setFrom(ranges.selection.startDate);
        setTo(ranges.selection.endDate);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const open = Boolean(anchorEl);
    const [showPartialSubmissionBanner, setShowPartialSubmissionBanner] = useState(true);


    return (
        <>
            {showPartialSubmissionBanner && !doesPartialSubmissionPointExist && (
                <PartialSubmissionBanner
                    onDismiss={() => setShowPartialSubmissionBanner(false)}
                />
            )}
            <div className="entries-header">
                <div className="entries-header__section">
                    <div className="entries-header__filters">
                        <div className="entries-header__date-filters">
                            <div
                                className="entries-header__date-picker"
                                onClick={handleDatePickerClick}
                            >
                                <div className="date-picker__range">
                                    <div className="date-picker__field">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="date-picker__value">
                                            {formatDate(from) || __('Start date', 'quillforms')}
                                        </span>
                                    </div>

                                    <div className="date-picker__separator">→</div>

                                    <div className="date-picker__field">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className="date-picker__value">
                                            {formatDate(to) || __('End date', 'quillforms')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={handleDatePickerClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                classes={{
                                    paper: 'date-range-popover'
                                }}
                            >
                                <div className="date-range-picker-wrapper">
                                    <DateRangePicker
                                        ranges={dateRange}
                                        onChange={handleDateRangeChange}
                                        months={2}
                                        direction="horizontal"
                                        showSelectionPreview={true}
                                        moveRangeOnFirstSelection={false}
                                    />
                                    <div className="date-range-picker-actions">
                                        <button
                                            className="date-range-picker-cancel"
                                            onClick={handleDatePickerClose}
                                        >
                                            {__('Cancel', 'quillforms')}
                                        </button>
                                        <button
                                            className="date-range-picker-apply"
                                            onClick={() => {
                                                filterEntriesByDate();
                                                handleDatePickerClose();
                                            }}
                                        >
                                            {__('Apply', 'quillforms')}
                                        </button>
                                    </div>
                                </div>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="entries-header__controls">
                    <div className="entries-header__display-field">
                        <label>{__('Display Question:', 'quillforms')}</label>
                        <SelectControl
                            options={options}
                            value={options[selectedField]}
                            onChange={(selectedChoice) => setSelectedField(selectedChoice?.selectedItem?.key)}
                        />
                    </div>

                    <div className="entries-header__ordering">
                        <label>{__('Order by:', 'quillforms')}</label>
                        <div className="ordering-controls">
                            <SelectControl
                                options={orderByOptions}
                                value={orderByOptions[orderBy]}
                                onChange={(selectedChoice) => {
                                    setOrderBy(selectedChoice.selectedItem.key === 'date' ? 0 : 1);
                                }}
                            />
                            <SelectControl
                                options={orderOptions}
                                value={orderOptions[order]}
                                onChange={(selectedChoice) =>
                                    setOrder(selectedChoice.selectedItem.key === 'asc' ? 0 : 1)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EntriesHeader;
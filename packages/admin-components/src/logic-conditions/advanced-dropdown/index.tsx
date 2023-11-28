import React, { useState, useRef } from "react";
import useVariables from "../../combobox-control/use-variables";

import { DropdownMenu, MenuItem, MenuGroup } from '@wordpress/components';
import { chevronDown } from '@wordpress/icons';
import { BlockIconBox, TextControl } from "../..";
import classnames from "classnames";
import { css } from "emotion";
import { size } from "lodash"

const AdvancedDropdown = ({ var0, var1, onChange }) => {

    const ref = useRef(null);
    let options = [
        { type: 'input', label: "Enter a number" },
    ];

    const variables = useVariables({ section: 'variables' }).filter((variable) => variable.value !== var0.value).map(variable => {
        return {
            ...variable, label: <div className={css`display: flex;align-items: center; 
            .admin-components-block-icon-box {
                width: 28px;
                display: flex;
                justify-content: center;
            }`}><BlockIconBox icon={variable?.iconBox?.icon} color={variable?.iconBox?.color} /> <span className={css`margin: 0 8px`}>{variable?.label} </span></div>
        };
    });


    const handleChange = (selected) => {

        onChange(selected);
    };

    const handleNumberChange = (val) => {
        onChange({ value: val, type: "input" });
    };

    const selectedVariable = variables?.find(variable => variable.value === var1.value);

    return (
        <div className={classnames("logic-conditions-advanced-dropdown", css`
            cursor: ${var1?.type && var1?.type !== "input" ? "pointer" : "default"};
        `)} ref={ref} onClick={(
            event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ) => {
                if (var1?.type && var1?.type !== "input") {
                    event.stopPropagation();
                    ref.current.querySelector('button').click();
                }
            }}>
            <div className="">
                {!var1.type || var1?.type === "input" ? (
                    <TextControl
                        type="number"
                        placeholder="Enter a number"
                        value={var1.value ?? ''}
                        onChange={handleNumberChange}
                    />
                )
                    : (
                        <div className="logic-conditions-advanced-dropdown__variable-label">
                            {selectedVariable?.label}
                        </div>
                    )}
            </div>
            <DropdownMenu
                className="logic-conditions-advanced-dropdown__menu"
                icon={chevronDown}
            >
                {({ onClose }) => (
                    <MenuGroup>
                        {options.map((option) => (
                            <MenuItem
                                key={option.value}
                                onClick={() => {
                                    handleChange(option);
                                    onClose();
                                }}
                            >
                                {option.label}
                            </MenuItem>
                        ))}
                        {size(variables) > 0 && (
                            <>
                                <div className='combobox-control-select-section' onClick={(ev) => ev.stopPropagation()}>
                                    Variables
                                </div>
                                {variables.map((option) => (
                                    <MenuItem
                                        key={option.value}
                                        onClick={() => {
                                            handleChange(option);
                                            onClose();
                                        }}
                                    >
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </>
                        )}
                    </MenuGroup>


                )}
            </DropdownMenu>
        </div>
    );
};

export default AdvancedDropdown;
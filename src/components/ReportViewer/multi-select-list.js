/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import React, { useMemo, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Checkbox, FormControlLabel, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const styles = {
    notificationDot: {
        height: '6px',
        width: '6px',
        backgroundColor: '#cc70a0',
        borderRadius: '50%',
        position: 'absolute',
        top: '5px',
        left: '23px',
    },
    container: {
        position: 'relative',
    },
    icon: {
        width: '0.7em',
        height: '0.7em',
    },
    label: {
        width: '100%',
        margin: 0,
    },
    menuItem: {
        padding: '0 10px 0 0',
    },
};

/**
 * MultiSelectList allows to manipulate an object where each keys are associated to a boolean in order to determine which are the ones the user wants to select
 * A visual indication is displayed when the user alters the default state of the list
 *
 * @param {Object}   selectedItems    - It serves as the model and data of the Component each entry must be formatted as a pair of string and boolean. Each key will be displayed and the corresponding boolean is updated in function of its checkbox status
 * @param {Function} setSelectedItems - Setter needed to update the list underlying data
 */

export const MultiSelectList = ({ selectedItems, setSelectedItems }) => {
    const [initialState] = useState(selectedItems);
    const [anchorEl, setAnchorEl] = useState();
    const open = Boolean(anchorEl);

    const handleChange = (event) => {
        setSelectedItems((previousSelection) => {
            return {
                ...previousSelection,
                [event.target.name]: !selectedItems[event.target.name],
            };
        });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const isInitialStateModified = useMemo(() => {
        return Object.keys(selectedItems).some(
            (key) => initialState[key] !== selectedItems[key]
        );
    }, [initialState, selectedItems]);

    return (
        <Box sx={styles.container}>
            <IconButton onClick={handleClick}>
                <MenuIcon sx={styles.icon} />
                {isInitialStateModified && <Box sx={styles.notificationDot} />}
            </IconButton>
            <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
                {Object.entries(selectedItems).map(([key, value]) => {
                    return (
                        <MenuItem sx={styles.menuItem} key={key}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={value}
                                        onChange={handleChange}
                                        name={key}
                                    />
                                }
                                label={key}
                                sx={styles.label}
                            />
                        </MenuItem>
                    );
                })}
            </Menu>
        </Box>
    );
};

/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Hook taking an array of parameters with this format
// [{"name":"nameOfParam","type":"typeOfParam","description":"descriptionOfParam","defaultValue":"defaultValue","possibleValues":[arrayOfPossibleValue]}]
// Returns :
// - an object containing those modified values to be able to send them to a backend
// - a render of a form allowing to modify those values
// - a function allowing to reset the fields

import React, { useMemo, useState } from 'react';
import {
    Autocomplete,
    Chip,
    List,
    ListItem,
    Switch,
    Tooltip,
    Typography,
    TextField,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    paramListItem: {
        justifyContent: 'space-between',
        gap: theme.spacing(2),
    },
}));

function longestCommonPrefix(strs) {
    if (!strs?.length) return '';
    let prefix = strs.reduce((acc, str) =>
        str.length < acc.length ? str : acc
    );

    for (let str of strs) {
        while (str.slice(0, prefix.length) !== prefix) {
            prefix = prefix.slice(0, -1);
        }
    }
    return prefix;
}

export const useImportExportParams = (paramsAsArray) => {
    const classes = useStyles();
    const longestPrefix = longestCommonPrefix(paramsAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const defaultValues = useMemo(() => {
        return Object.fromEntries(
            paramsAsArray.map((m) => {
                if (m.type === 'BOOLEAN') return [m.name, m.defaultValue];
                if (m.type === 'STRING_LIST')
                    return [m.name, m.defaultValue ?? []];
                return [m.name, m.defaultValue ?? null];
            })
        );
    }, [paramsAsArray]);
    const [currentValues, setCurrentValues] = useState(defaultValues);

    const onFieldChange = (value, paramName) => {
        setCurrentValues((prevCurrentValues) => {
            const nextCurrentValues = { ...prevCurrentValues };
            nextCurrentValues[paramName] = value;
            return nextCurrentValues;
        });
    };

    const renderField = (param) => {
        switch (param.type) {
            case 'BOOLEAN':
                return (
                    <Switch
                        checked={
                            currentValues?.[param.name] ??
                            defaultValues[param.name]
                        }
                        onChange={(e) =>
                            onFieldChange(e.target.checked, param.name)
                        }
                    />
                );
            case 'STRING_LIST':
                return (
                    <Autocomplete
                        fullWidth
                        multiple
                        options={param.possibleValues ?? []}
                        freeSolo={!param.possibleValues}
                        onChange={(e, value) =>
                            onFieldChange(value, param.name)
                        }
                        value={
                            currentValues?.[param.name] ??
                            defaultValues[param.name]
                        }
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(options) => (
                            <TextField {...options} variant="standard" />
                        )}
                    />
                );
            default:
                return (
                    <TextField
                        fullWidth
                        defaultValue={
                            currentValues?.[param.name] ??
                            defaultValues[param.name]
                        }
                        onChange={(e) =>
                            onFieldChange(e.target.value, param.name)
                        }
                        variant={'standard'}
                    />
                );
        }
    };

    const resetValuesToDefault = () => {
        setCurrentValues({});
    };

    const paramsComponent = (
        <List>
            {paramsAsArray.map((param) => (
                <Tooltip
                    title={param.description}
                    enterDelay={1200}
                    key={param.name}
                >
                    <ListItem
                        key={param.name}
                        className={classes.paramListItem}
                    >
                        <Typography style={{ minWidth: '30%' }}>
                            {param.name.slice(prefix.length)}
                        </Typography>
                        {renderField(param)}
                    </ListItem>
                </Tooltip>
            ))}
        </List>
    );

    return [currentValues, paramsComponent, resetValuesToDefault];
};

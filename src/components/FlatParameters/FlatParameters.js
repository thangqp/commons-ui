/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {
    Autocomplete,
    Chip,
    List,
    ListItem,
    MenuItem,
    Select,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    paramList: {
        width: '100%',
        margin: 0,
    },
    paramListItem: {
        justifyContent: 'space-between',
        gap: theme.spacing(2),
        paddingLeft: 0,
        paddingRight: 0,
    },
    paramName: {
        fontWeight: 'bold',
        minWidth: '30%',
        overflowWrap: 'anywhere',
    },
}));

const FloatRE = /^-?\d*[.,]?\d*([eE]-?\d*)?$/;
const IntegerRE = /^-?\d*$/;
const ListRE = /^\[(.*)]$/;
const sepRE = /[, ]/;

export function extractDefault(paramDescription) {
    const d = paramDescription.defaultValue;
    if (paramDescription.type === 'BOOLEAN') {
        return !!d;
    }
    if (paramDescription.type === 'DOUBLE') {
        return d - 0.0;
    }
    if (paramDescription.type === 'INTEGER') {
        return d - 0;
    }
    if (paramDescription.type === 'STRING_LIST') {
        if (Array.isArray(d)) {
            return d;
        }
        const mo = ListRE.exec(d);
        if (mo?.length > 1) {
            return mo[1]
                .split(sepRE)
                .map((s) => s.trim())
                .filter((s) => !!s);
        }
        return [];
    }
    return d ?? null;
}

function longestCommonPrefix(strs) {
    if (!strs?.length) {
        return '';
    }
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

/**
 * Present a "list" of independently editable parameters according to
 * their description, as given by paramsAsArray, with current values as in initValues.
 * @param paramsAsArray [{type,name,possibleValues,defaultValue}]
 * @param initValues {k:v}
 * @param onChange (paramName, newValue, isInEdition)
 * @param variant style variant for TextField, Autocomplete and Select parameter fields
 */
export const FlatParameters = ({
    paramsAsArray,
    initValues,
    onChange,
    variant = 'outlined',
}) => {
    const classes = useStyles();
    const intl = useIntl();

    const longestPrefix = longestCommonPrefix(paramsAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const [uncommitted, setUncommitted] = useState(null);
    const [inEditionParam, setInEditionParam] = useState(null);

    const preparePossibleValues = useCallback(
        (values) => {
            if (values == null) {
                return [];
            }
            return values
                .map((v) => intl.formatMessage({ id: v, defaultMessage: v }))
                .sort((a, b) => a.localeCompare(b));
        },
        [intl]
    );

    const onFieldChange = useCallback(
        (value, param) => {
            const paramName = param.name;
            const isInEdition = inEditionParam === paramName;
            if (isInEdition) {
                setUncommitted(value);
            }
            if (onChange) {
                if (Array.isArray(value)) {
                    onChange(paramName, [...value], isInEdition);
                } else {
                    onChange(paramName, value, isInEdition);
                }
            }
        },
        [inEditionParam, onChange]
    );

    const onUncommited = useCallback(
        (param, inEdit) => {
            if (inEdit) {
                setInEditionParam(param.name);
            } else {
                if (onChange && uncommitted != null) {
                    if (!['INTEGER', 'DOUBLE'].includes(param.type)) {
                        onChange(param.name, uncommitted, false);
                    } else if (uncommitted) {
                        // may give NaN
                        onChange(param.name, uncommitted - 0, false);
                    } else {
                        onChange(param.name, extractDefault(param), false);
                    }
                }
                setInEditionParam(null);
                setUncommitted(null);
            }
        },
        [uncommitted, onChange]
    );

    function mixInitAndDefault(param) {
        if (param.name === inEditionParam && uncommitted !== null) {
            return uncommitted;
        } else if (initValues && initValues.hasOwnProperty(param.name)) {
            return initValues[param.name];
        } else {
            return extractDefault(param);
        }
    }

    const renderField = (param) => {
        const value = mixInitAndDefault(param);
        switch (param.type) {
            case 'BOOLEAN':
                return (
                    <Switch
                        checked={!!value}
                        onChange={(e) => onFieldChange(e.target.checked, param)}
                    />
                );
            case 'DOUBLE':
                const err =
                    isNaN(value) ||
                    (typeof value !== 'number' && !!value && isNaN(value - 0));
                return (
                    <TextField
                        fullWidth
                        sx={{ input: { textAlign: 'right' } }}
                        value={value}
                        onFocus={() => onUncommited(param, true)}
                        onBlur={() => onUncommited(param, false)}
                        onChange={(e) => {
                            const m = FloatRE.exec(e.target.value);
                            if (m) {
                                onFieldChange(e.target.value, param);
                            }
                        }}
                        error={err}
                        variant={variant}
                    />
                );
            case 'INTEGER':
                return (
                    <TextField
                        fullWidth
                        sx={{ input: { textAlign: 'right' } }}
                        value={value}
                        onFocus={() => onUncommited(param, true)}
                        onBlur={() => onUncommited(param, false)}
                        onChange={(e) => {
                            const m = IntegerRE.exec(e.target.value);
                            if (m) {
                                onFieldChange(e.target.value, param);
                            }
                        }}
                        variant={variant}
                    />
                );
            case 'STRING_LIST':
                if (param.possibleValues) {
                    return (
                        <Autocomplete
                            fullWidth
                            multiple
                            options={preparePossibleValues(
                                param.possibleValues
                            )}
                            onChange={(e, value) => onFieldChange(value, param)}
                            value={value}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        label={option}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                            renderInput={(options) => (
                                <TextField {...options} variant={variant} />
                            )}
                        />
                    );
                }
            // else fallthrough to default
            case 'STRING':
                if (param.possibleValues) {
                    return (
                        <>
                            <Select
                                labelId={param.name}
                                value={value ?? ''}
                                onChange={(ev, may) => {
                                    onFieldChange(ev.target.value, param);
                                }}
                                size="small"
                                sx={{ minWidth: '4em' }}
                                variant={variant}
                            >
                                {param.possibleValues.map((value) => (
                                    <MenuItem key={value} value={value}>
                                        <Typography>
                                            {intl.formatMessage({
                                                id: value,
                                                defaultMessage: value,
                                            })}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Select>
                        </>
                    );
                }
            // else fallthrough to default
            default:
                return (
                    <TextField
                        fullWidth
                        defaultValue={value}
                        onFocus={() => onUncommited(param, true)}
                        onBlur={() => onUncommited(param, false)}
                        onChange={(e) => onFieldChange(e.target.value, param)}
                        variant={variant}
                    />
                );
        }
    };

    return (
        <List className={classes.paramList}>
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
                        <Typography className={classes.paramName}>
                            {param.name.slice(prefix.length)}
                        </Typography>
                        {renderField(param)}
                    </ListItem>
                </Tooltip>
            ))}
        </List>
    );
};

export default FlatParameters;

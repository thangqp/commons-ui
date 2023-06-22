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
    Divider,
} from '@mui/material';
import { FormattedMessage, useIntl } from 'react-intl';

const useStyles = makeStyles((theme) => ({
    paramList: {
        width: '100%',
        margin: 0,
    },
    paramListItem: {
        display: 'flex',
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

function longestCommonPrefix(stringList) {
    if (!stringList?.length) {
        return '';
    }
    let prefix = stringList.reduce((acc, str) =>
        str.length < acc.length ? str : acc
    );

    for (let str of stringList) {
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
    showSeparator = false,
}) => {
    const classes = useStyles();
    const intl = useIntl();

    const longestPrefix = longestCommonPrefix(paramsAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const [uncommitted, setUncommitted] = useState(null);
    const [inEditionParam, setInEditionParam] = useState(null);

    const getTranslatedValue = useCallback(
        (prefix, value) => {
            return intl.formatMessage({
                id: prefix + '.' + value,
                defaultMessage: value,
            });
        },
        [intl]
    );

    const sortPossibleValues = useCallback(
        (prefix, values) => {
            if (values == null) {
                return [];
            }
            // Sort by translated values
            return values
                .map((value) => {
                    return {
                        id: value,
                        message: getTranslatedValue(prefix, value),
                    };
                })
                .sort((a, b) => a.message.localeCompare(b.message));
        },
        [getTranslatedValue]
    );

    const onFieldChange = useCallback(
        (value, param) => {
            const paramName = param.name;
            const isInEdition = inEditionParam === paramName;
            if (isInEdition) {
                setUncommitted(value);
            }
            if (onChange) {
                if (param.type === 'STRING_LIST') {
                    onChange(
                        paramName,
                        value ? value.toString() : null,
                        isInEdition
                    );
                } else {
                    onChange(paramName, value, isInEdition);
                }
            }
        },
        [inEditionParam, onChange]
    );

    const onUncommitted = useCallback(
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
            if (param.type !== 'STRING_LIST') {
                return initValues[param.name];
            }
            const valueList = initValues[param.name];
            if (Array.isArray(valueList)) {
                return valueList;
            }
            // otherwise split string into array
            return valueList
                ? valueList
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => !!s)
                : [];
        } else {
            return extractDefault(param);
        }
    }

    const outputTransformFloatString = (value) => {
        return value?.replace(',', '.') || '';
    };

    const renderField = (param) => {
        const fieldValue = mixInitAndDefault(param);
        switch (param.type) {
            case 'BOOLEAN':
                return (
                    <Switch
                        checked={!!fieldValue}
                        onChange={(e) => onFieldChange(e.target.checked, param)}
                    />
                );
            case 'DOUBLE':
                const err =
                    isNaN(fieldValue) ||
                    (typeof fieldValue !== 'number' &&
                        !!fieldValue &&
                        isNaN(fieldValue - 0));
                return (
                    <TextField
                        size={'small'}
                        sx={{ width: '50%' }}
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={fieldValue}
                        onFocus={() => onUncommitted(param, true)}
                        onBlur={() => onUncommitted(param, false)}
                        onChange={(e) => {
                            const m = FloatRE.exec(e.target.value);
                            if (m) {
                                onFieldChange(
                                    outputTransformFloatString(e.target.value),
                                    param
                                );
                            }
                        }}
                        error={err}
                        variant={variant}
                    />
                );
            case 'INTEGER':
                return (
                    <TextField
                        size={'small'}
                        sx={{ width: '50%' }}
                        inputProps={{ style: { textAlign: 'right' } }}
                        value={fieldValue}
                        onFocus={() => onUncommitted(param, true)}
                        onBlur={() => onUncommitted(param, false)}
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
                            size={'small'}
                            options={sortPossibleValues(
                                param.name,
                                param.possibleValues
                            ).map((v) => v.id)}
                            getOptionLabel={(option) =>
                                getTranslatedValue(param.name, option)
                            }
                            onChange={(e, value) => onFieldChange(value, param)}
                            value={fieldValue}
                            renderTags={(values, getTagProps) => {
                                return values.map((value, index) => (
                                    <Chip
                                        label={getTranslatedValue(
                                            param.name,
                                            value
                                        )}
                                        {...getTagProps({ index })}
                                    />
                                ));
                            }}
                            renderInput={(inputProps) => (
                                <TextField {...inputProps} variant={variant} />
                            )}
                        />
                    );
                } else {
                    // no possible values => free user inputs
                    return (
                        <Autocomplete
                            multiple
                            freeSolo
                            autoSelect
                            sx={{ width: '50%' }}
                            options={[]}
                            size={'small'}
                            onChange={(e, value) => onFieldChange(value, param)}
                            value={fieldValue}
                            renderTags={(values, getTagProps) => {
                                return values.map((value, index) => (
                                    <Chip
                                        id={'chip_' + value}
                                        size={'small'}
                                        label={value}
                                        {...getTagProps({ index })}
                                    />
                                ));
                            }}
                            renderInput={(inputProps) => (
                                <TextField {...inputProps} variant={variant} />
                            )}
                        />
                    );
                }
            case 'STRING':
                if (param.possibleValues) {
                    return (
                        <>
                            <Select
                                labelId={param.name}
                                value={fieldValue ?? ''}
                                onChange={(ev) => {
                                    onFieldChange(ev.target.value, param);
                                }}
                                size="small"
                                sx={{ minWidth: '4em' }}
                                variant={variant}
                            >
                                {sortPossibleValues(
                                    param.name,
                                    param.possibleValues
                                ).map((value) => (
                                    <MenuItem key={value.id} value={value.id}>
                                        <Typography>{value.message}</Typography>
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
                        sx={{ width: '50%' }}
                        size={'small'}
                        value={fieldValue || ''}
                        onFocus={() => onUncommitted(param, true)}
                        onBlur={() => onUncommitted(param, false)}
                        onChange={(e) => onFieldChange(e.target.value, param)}
                        variant={variant}
                    />
                );
        }
    };

    return (
        <List className={classes.paramList}>
            {paramsAsArray.map((param, index) => (
                <React.Fragment key={param.name}>
                    <ListItem className={classes.paramListItem}>
                        <Tooltip
                            title={
                                <FormattedMessage
                                    id={param.name + '.desc'}
                                    defaultMessage={param.description}
                                />
                            }
                            enterDelay={1200}
                            key={param.name}
                        >
                            <Typography className={classes.paramName}>
                                <FormattedMessage
                                    id={param.name}
                                    defaultMessage={param.name.slice(
                                        prefix.length
                                    )}
                                />
                            </Typography>
                        </Tooltip>
                        {renderField(param)}
                    </ListItem>
                    {showSeparator && index !== paramsAsArray.length - 1 && (
                        <Divider />
                    )}
                </React.Fragment>
            ))}
        </List>
    );
};

export default FlatParameters;

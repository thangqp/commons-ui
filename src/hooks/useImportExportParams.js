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

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import {
    Autocomplete,
    Chip,
    List,
    ListItem,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Grid from '@mui/material/Grid';
import {useMemoDebug} from "../utils/functions";

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

const FloatRE = /^-?[0-9]*[.,]?[0-9]*$/;
const IntegerRE = /^-?[0-9]*$/;
const ListRE = /^\[(.*)]$/;
const sepRE = /[, ]/;

function extractDefault(paramDescription) {
    const d = paramDescription.defaultValue;
    if (paramDescription.type === 'BOOLEAN') return !!d;
    if (paramDescription.type === 'DOUBLE') return d - 0.0;
    if (paramDescription.type === 'INTEGER') return d - 0;
    if (paramDescription.type === 'STRING_LIST') {
        if (Array.isArray(d)) return d;
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

function extractDefaultMap(paramsAsArray) {
    return Object.fromEntries(
        paramsAsArray.map((paramDescription) => {
            return [paramDescription.name, extractDefault(paramDescription)];
        })
    );
}

function areEquivDeeply(a, b) {
    if (a === b) return true;
    const aIsArray = Array.isArray(a);
    const bIsArray = Array.isArray(b);
    if (aIsArray || bIsArray) {
        if (aIsArray && bIsArray && a.length === b.length) {
            let i = 0;
            for (; i < a.length && areEquivDeeply(a[i], b[i]); ++i) {}
            if (i >= a.length) return true;
        }
        return false;
    }
    const aIsObj = typeof a === 'object';
    const bIsObj = typeof b === 'object';
    if (aIsObj || bIsObj) {
        return (
            aIsObj &&
            bIsObj &&
            areEquivDeeply(Object.entries(a), Object.entries(b))
        );
    }

    return false;
}

function makeFullMap(defaultMap, changingMap) {
    if (!changingMap) return { ...defaultMap };

    const full = {};

    Object.entries(defaultMap).forEach(([k, v]) => {
        if (!changingMap.hasOwnProperty(k)) {
            full[k] = v;
        } else {
            const m = changingMap[k];
            if (!areEquivDeeply(v, m)) {
                full[k] = m;
            } else {
                full[k] = v;
            }
        }
    });

    return full;
}

function makeDeltaMap(defaultMap, changingMap) {
    if (!changingMap) return null;

    const delta = {};

    Object.entries(defaultMap).forEach(([k, v]) => {
        const m = changingMap[k];
        if (!areEquivDeeply(v, m)) {
            console.debug('Δ', k, v, m);
            delta[k] = m;
        }
    });

    return Object.keys(delta).length ? delta : null;
}

export const useImportExportParams = (
    paramsAsArray,
    initValues,
    returnsDelta = true
) => {
    const classes = useStyles();
    const longestPrefix = longestCommonPrefix(paramsAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const defaultValues = useMemo(() => {
        return extractDefaultMap(paramsAsArray);
    }, [paramsAsArray]);
    const baseValues = useMemoDebug(() => {
        return makeFullMap(defaultValues, initValues);
    }, [defaultValues, initValues]);

    const [currentValues, setCurrentValues] = useState(baseValues);
    const [uncommitted, setUncommitted] = useState(null);
    const [inEditionParam, setInEditionParam] = useState(null);
    const prevRef = useRef();

    // console.debug('useImportExportParams', {
    //     returnsDelta,
    //     initValues,
    //     paramsAsArray,
    //     inEditionParam,
    //     uncommitted,
    //     currentValues,
    //     prev: prevRef.current,
    // });

    const onFieldChange = useCallback(
        (value, paramName) => {
            // console.debug('onFieldChange', inEditionParam, value, paramName);
            if (inEditionParam === paramName) {
                setUncommitted(value);
            } else {
                setCurrentValues((prevCurrentValues) => {
                    const ret = {
                        ...prevCurrentValues,
                        ...{ [paramName]: value },
                    };
                    // console.debug(
                    //     'setCurrentValues',
                    //     paramName,
                    //     value,
                    //     ret,
                    //     prevCurrentValues
                    // );
                    return ret;
                });
            }
        },
        [inEditionParam]
    );

    const onUncommited = useCallback(
        (param, inEdit) => {
            // console.debug('onUncommited.0', inEdit, inEditionParam, param);
            if (inEdit) {
                setInEditionParam(param.name);
            } else {
                // console.debug('onUncommited.1', uncommitted);
                if (uncommitted != null) {
                    setCurrentValues((prevCurrentValues) => {
                        const ret = { ...prevCurrentValues };
                        if (['INTEGER', 'DOUBLE'].includes(param.type)) {
                            ret[param.name] = uncommitted - 0;
                        } else {
                            ret[param.name] = uncommitted;
                        }
                        // console.debug('onUncommited.2', ret);
                        return ret;
                    });
                }
                // console.debug('onUncommited.3');
                setInEditionParam(null);
                setUncommitted(null);
                // console.debug('onUncommited.4');
            }
        },
        [inEditionParam, uncommitted]
    );

    const resetValuesToDefault = useCallback(
        (isToInit = true) => {
            setCurrentValues(isToInit ? baseValues : defaultValues);
        },
        [defaultValues, baseValues]
    );

    const renderField = (param) => {
        const value = param.name === inEditionParam && uncommitted !== null
            ? uncommitted
            : currentValues?.[param.name] ?? baseValues[param.name] ?? null;
        // console.debug('renderField', value, param);
        switch (param.type) {
            case 'BOOLEAN':
                return (
                    <Switch
                        checked={!!value}
                        onChange={(e) =>
                            onFieldChange(e.target.checked, param.name)
                        }
                    />
                );
            case 'DOUBLE':
                return (
                    <TextField
                        fullWidth
                        value={value}
                        onFocus={() => onUncommited(param, true)}
                        onBlur={() => onUncommited(param, false)}
                        onChange={(e) => {
                            const m = FloatRE.exec(e.target.value);
                            console.debug(
                                'double.onChange',
                                value,
                                m,
                                e.target.value
                            );
                            if (m) {
                                onFieldChange(e.target.value, param.name);
                            }
                        }}
                        variant={'standard'}
                    />
                );
            case 'INTEGER':
                return (
                    <TextField
                        fullWidth
                        value={value}
                        onFocus={() => onUncommited(param, true)}
                        onBlur={() => onUncommited(param, false)}
                        onChange={(e) => {
                            const m = IntegerRE.exec(e.target.value);
                            console.debug(
                                'double.onChange',
                                value,
                                m,
                                e.target.value
                            );
                            if (m) {
                                onFieldChange(e.target.value, param.name);
                            }
                        }}
                        variant={'standard'}
                    />
                );
            case 'STRING_LIST':
                if (param.possibleValues) {
                    return (
                        <Autocomplete
                            fullWidth
                            multiple
                            options={param.possibleValues}
                            onChange={(e, value) =>
                                onFieldChange(value, param.name)
                            }
                            value={value}
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
                }
            // else fallthrough to default
            case 'STRING':
                if (param.possibleValues) {
                    return (
                        <Autocomplete
                            fullWidth
                            disableClearable
                            options={param.possibleValues}
                            onChange={(e, value) =>
                                onFieldChange(value, param.name)
                            }
                            value={value}
                            renderInput={(options) => (
                                <TextField {...options} variant="standard" />
                            )}
                        />
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
                        onChange={(e) =>
                            onFieldChange(e.target.value, param.name)
                        }
                        variant={'standard'}
                    />
                );
        }
    };

    const renderAsList = () => {
        return (
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
    };

    const renderAsGrid = () => {
        return (
            <Grid container>
                {paramsAsArray.map((param) => (
                    <>
                        <Grid item xs="4" key={param.name + '^title'}>
                            <Tooltip
                                title={param.description}
                                enterDelay={1200}
                            >
                                <Typography style={{ minWidth: '30%' }}>
                                    {param.name.slice(prefix.length)}
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={8} key={param.name + '^value'}>
                            {renderField(param)}
                        </Grid>
                    </>
                ))}
            </Grid>
        );
    };

    let ret;
    if (
        prevRef.current &&
        areEquivDeeply(prevRef.current.currentValues, currentValues)
    ) {
        if (!returnsDelta) {
            ret = [
                prevRef.current.currentValues,
                renderAsGrid(),
                resetValuesToDefault,
            ];
        } else if (!prevRef.current.deltaValues) {
            ret = [
                makeDeltaMap(defaultValues, currentValues),
                renderAsGrid(),
                resetValuesToDefault,
            ];
        } else {
            ret = [
                prevRef.current.deltaValues,
                renderAsGrid(),
                resetValuesToDefault,
            ];
        }
    } else {
        ret = [
            returnsDelta
                ? makeDeltaMap(defaultValues, currentValues)
                : currentValues,
            renderAsGrid(),
            resetValuesToDefault,
        ];
    }

    prevRef.current = {
        currentValues,
        jsx: ret[1],
        deltaValues: returnsDelta ? ret[0] : null,
    };

    // console.debug(
    //     'genericParams',
    //     returnsDelta,
    //     inEditionParam,
    //     prevRef.current,
    //     { ret0: ret[0], uncommitted }
    // );

    return ret;
};

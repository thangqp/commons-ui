import React, { useCallback, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
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

const useStyles = makeStyles((theme) => ({
    paramListItem: {
        justifyContent: 'space-between',
        gap: theme.spacing(2),
    },
}));

const FloatRE = /^-?\d*[.,]?\d*([eE]-?\d*)?$/;
const IntegerRE = /^-?\d*$/;
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

let instanceCount = 0;

/**
 *
 * @param paramsAsArray [{type,name,possibleValues,defaultValue}]
 * @param initValues {k:v}
 * @param onChange (paramName, newValue, isInEdition)
 * @returns JSX
 * @constructor
 */
export const FlatParameters = ({ paramsAsArray, initValues, onChange }) => {
    const [instanceId] = useState(() => {
        console.debug('FlatParameters.instanceInit', instanceCount);
        instanceCount += 1;
        return instanceCount;
    });
    console.debug('FlatParameters', {
        instanceId,
        paramsAsArray,
        initValues,
    });
    useEffect(() => {
        console.debug('FlatParameters.mount', instanceId, instanceCount);
        return () => {
            console.debug('FlatParameters.unmount', instanceId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const classes = useStyles();
    const longestPrefix = longestCommonPrefix(paramsAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const [uncommitted, setUncommitted] = useState(null);
    const [inEditionParam, setInEditionParam] = useState(null);

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
                    if (['INTEGER', 'DOUBLE'].includes(param.type)) {
                        onChange(param.name, uncommitted - 0, false);
                    } else {
                        onChange(param.name, uncommitted, false);
                    }
                }
                setInEditionParam(null);
                setUncommitted(null);
            }
        },
        [uncommitted, onChange]
    );

    const renderField = (param) => {
        const value =
            param.name === inEditionParam && uncommitted !== null
                ? uncommitted
                : initValues && initValues.hasOwnProperty(param.name)
                ? initValues[param.name]
                : extractDefault(param);
        switch (param.type) {
            case 'BOOLEAN':
                return (
                    <Switch
                        checked={!!value}
                        onChange={(e) => onFieldChange(e.target.checked, param)}
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
                                onFieldChange(e.target.value, param);
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
                                onFieldChange(e.target.value, param);
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
                            onChange={(e, value) => onFieldChange(value, param)}
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
                            onChange={(e, value) => onFieldChange(value, param)}
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
                        onChange={(e) => onFieldChange(e.target.value, param)}
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

    return renderAsList();
};

export default FlatParameters;

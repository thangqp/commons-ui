/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// adapted from
//    https://reactjs.org/docs/error-boundaries.html
//    https://mui.com/material-ui/react-card/#complex-interaction
//

// Hook taking an array of parameters with this format
// [{"name":"nameOfParam","type":"typeOfParam","description":"descriptionOfParam","defaultValue":"defaultValue","possibleValues":[arrayOfPossibleValue]}]
// Returns :
// - a render of a form allowing to modify those values
// - an object containing those modified values to be able to send them to a backend
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

export const useMeta = (metasAsArray) => {
    const classes = useStyles();
    const longestPrefix = longestCommonPrefix(metasAsArray.map((m) => m.name));
    const lastDotIndex = longestPrefix.lastIndexOf('.');
    const prefix = longestPrefix.slice(0, lastDotIndex + 1);

    const defaultInst = useMemo(() => {
        return Object.fromEntries(
            metasAsArray.map((m) => {
                if (m.type === 'BOOLEAN') return [m.name, m.defaultValue];
                if (m.type === 'STRING_LIST')
                    return [m.name, m.defaultValue ?? []];
                return [m.name, m.defaultValue ?? null];
            })
        );
    }, [metasAsArray]);
    const [inst, setInst] = useState(defaultInst);

    const onBoolChange = (value, paramName) => {
        setInst((prevInst) => {
            const nextInst = { ...prevInst };
            nextInst[paramName] = value;
            return nextInst;
        });
    };

    const onFieldChange = (value, paramName) => {
        setInst((prevInst) => {
            const nextInst = { ...prevInst };
            nextInst[paramName] = value;
            return nextInst;
        });
    };

    const renderField = (meta) => {
        switch (meta.type) {
            case 'BOOLEAN':
                return (
                    <Switch
                        checked={inst?.[meta.name] ?? defaultInst[meta.name]}
                        onChange={(e) =>
                            onBoolChange(e.target.checked, meta.name)
                        }
                    />
                );
            case 'STRING_LIST':
                return (
                    <Autocomplete
                        fullWidth
                        multiple
                        options={meta.possibleValues ?? []}
                        freeSolo={!meta.possibleValues}
                        onChange={(e, value) => onFieldChange(value, meta.name)}
                        value={inst?.[meta.name] ?? defaultInst[meta.name]}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip
                                    variant="outlined"
                                    label={option}
                                    {...getTagProps({ index })}
                                />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="standard" />
                        )}
                    />
                );
            default:
                return (
                    <TextField
                        fullWidth
                        defaultValue={
                            inst?.[meta.name] ?? defaultInst[meta.name]
                        }
                        onChange={(e) =>
                            onFieldChange(e.target.value, meta.name)
                        }
                        variant={'standard'}
                    />
                );
        }
    };

    const resetValueToDefault = () => {
        setInst({});
    };

    const comp = (
        <List>
            {metasAsArray.map((meta) => (
                <Tooltip
                    title={meta.description}
                    enterDelay={1200}
                    key={meta.name}
                >
                    <ListItem key={meta.name} className={classes.paramListItem}>
                        <Typography style={{ minWidth: '30%' }}>
                            {meta.name.slice(prefix.length)}
                        </Typography>
                        {renderField(meta)}
                    </ListItem>
                </Tooltip>
            ))}
        </List>
    );

    return [inst, comp, resetValueToDefault];
};

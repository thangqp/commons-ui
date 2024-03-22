/**
 * Copyright (c) 2021, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Clear as ClearIcon } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';

const TextFieldWithAdornment = (props) => {
    const {
        adornmentPosition,
        adornmentText,
        value,
        variant,
        handleClearValue,
        ...otherProps
    } = props;
    const [isFocused, setIsFocused] = useState(false);

    const getAdornmentStyle = useCallback((variant) => {
        if (variant === 'filled') {
            return {
                alignItems: 'start',
                marginBottom: '0.4em',
            };
        }
        if (variant === 'standard') {
            return {
                marginBottom: '0.3em',
            };
        }
        return undefined;
    }, []);

    const getClearAdornment = useCallback(
        (position) => {
            return (
                <InputAdornment position={position}>
                    <IconButton onClick={handleClearValue}>
                        <ClearIcon />
                    </IconButton>
                </InputAdornment>
            );
        },
        [handleClearValue]
    );

    const getTextAdornment = useCallback(
        (position) => {
            return (
                <InputAdornment
                    position={position}
                    sx={getAdornmentStyle(variant)}
                >
                    {adornmentText}
                </InputAdornment>
            );
        },
        [adornmentText, getAdornmentStyle, variant]
    );

    const withEndAdornmentText = useCallback(() => {
        return value !== '' || isFocused
            ? {
                  startAdornment:
                      value && handleClearValue
                          ? getClearAdornment('start')
                          : undefined,
                  endAdornment: getTextAdornment('end'),
                  sx: { textAlign: 'end' },
              }
            : undefined;
    }, [
        value,
        handleClearValue,
        getClearAdornment,
        isFocused,
        getTextAdornment,
    ]);

    const withStartAdornmentText = useCallback(() => {
        return value !== '' || isFocused
            ? {
                  startAdornment: getTextAdornment('start'),
                  endAdornment:
                      value && handleClearValue && getClearAdornment('end'),
                  sx: { textAlign: 'start' },
              }
            : undefined;
    }, [
        value,
        handleClearValue,
        getClearAdornment,
        isFocused,
        getTextAdornment,
    ]);

    return (
        <TextField
            {...otherProps} //TODO move at the end like other inputs ?
            variant={variant}
            value={value}
            InputProps={
                adornmentPosition === 'start'
                    ? withStartAdornmentText()
                    : withEndAdornmentText()
            }
            onFocus={(e) => setIsFocused(true)}
            onBlur={(e) => setIsFocused(false)}
        />
    );
};

TextFieldWithAdornment.propTypes = {
    adornmentPosition: PropTypes.string.isRequired,
    adornmentText: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    variant: PropTypes.string,
    handleClearValue: PropTypes.func,
};

export default TextFieldWithAdornment;

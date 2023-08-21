/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useController, useFormContext } from 'react-hook-form';
import TextFieldWithAdornment from './utils/text-field-with-adornment';
import FieldLabel from './utils/field-label';
import {
    genHelperError,
    genHelperPreviousValue,
    identity,
    isFieldRequired,
} from './utils/functions';

const TextInput = ({
    name,
    label,
    labelValues, // this prop is used to add a value to label. this value is displayed without being translated
    id,
    adornment,
    customAdornment,
    outputTransform = identity, //transform materialUi input value before sending it to react hook form, mostly used to deal with number fields
    inputTransform = identity, //transform react hook form value before sending it to materialUi input, mostly used to deal with number fields
    acceptValue = () => true, //used to check user entry before committing the input change, used mostly to prevent user from typing a character in number field
    previousValue,
    clearable,
    formProps,
}) => {
    const { validationSchema, getValues, removeOptional } = useFormContext();
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const Field = adornment ? TextFieldWithAdornment : TextField;

    const handleClearValue = () => {
        onChange(outputTransform(''));
    };

    const handleValueChanged = (e) => {
        if (acceptValue(e.target.value)) {
            onChange(outputTransform(e.target.value));
        }
    };

    const transformedValue = inputTransform(value);

    const fieldLabel = !label
        ? null
        : FieldLabel({
              label,
              values: labelValues,
              optional:
                  !isFieldRequired(name, validationSchema, getValues()) &&
                  !formProps?.disabled &&
                  !removeOptional,
          });

    return (
        <Field
            key={id ? id : label}
            size="small"
            fullWidth
            id={id ? id : label}
            label={fieldLabel}
            {...(adornment && {
                adornmentPosition: adornment.position,
                adornmentText: adornment?.text,
            })}
            value={transformedValue}
            onChange={handleValueChanged}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        {clearable &&
                            transformedValue !== undefined &&
                            transformedValue !== '' && (
                                <IconButton onClick={handleClearValue}>
                                    <ClearIcon />
                                </IconButton>
                            )}
                        {customAdornment && { ...customAdornment }}
                    </InputAdornment>
                ),
            }}
            inputRef={ref}
            {...(clearable &&
                adornment && {
                    handleClearValue: handleClearValue,
                })}
            {...genHelperPreviousValue(previousValue, adornment)}
            {...genHelperError(error?.message)}
            {...formProps}
        />
    );
};

TextInput.propTypes = {
    name: PropTypes.string,
    label: PropTypes.string,
    labelValues: PropTypes.object,
    id: PropTypes.string,
    adornment: PropTypes.object,
    customAdornment: PropTypes.object,
    outputTransform: PropTypes.func,
    inputTransform: PropTypes.func,
    acceptValue: PropTypes.func,
    previousValue: PropTypes.any,
    clearable: PropTypes.bool,
    formProps: PropTypes.object,
};

export default TextInput;

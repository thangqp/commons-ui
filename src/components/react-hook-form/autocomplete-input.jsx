/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import PropTypes from 'prop-types';
import { Autocomplete, TextField } from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import {
    genHelperError,
    genHelperPreviousValue,
    identity,
    isFieldRequired,
} from './utils/functions';
import FieldLabel from './utils/field-label';

const AutocompleteInput = ({
    name,
    label,
    options,
    outputTransform = identity, //transform materialUi input value before sending it to react hook form, mostly used to deal with select fields that need to return a string
    inputTransform = identity, //transform react hook form value before sending it to materialUi input, mostly used to deal with select fields that need to return a string
    readOnly = false,
    previousValue,
    allowNewValue,
    onChangeCallback, // method called when input value is changing
    formProps,
    ...props
}) => {
    const { validationSchema, getValues, removeOptional } = useFormContext();
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const handleChange = (value) => {
        onChangeCallback && onChangeCallback();
        //if free solo not enabled or if value is not of string type, we call onChange right away
        if (!allowNewValue || typeof value !== 'string') {
            onChange(outputTransform(value));
            return;
        }

        //otherwise, we check if user input matches with one of the options
        const matchingOption = options.find((option) => option.id === value);
        //if it does, we send the matching option to react hook form
        if (matchingOption) {
            onChange(outputTransform(matchingOption));
            return;
        }

        //otherwise, we send the user input
        onChange(outputTransform(value));
    };

    return (
        <Autocomplete
            value={inputTransform(value)}
            onChange={(_, data) => handleChange(data)}
            {...(allowNewValue && {
                freeSolo: true,
                autoComplete: true,
                blurOnSelect: true,
                autoSelect: false,
                onInputChange: (_, data) => {
                    handleChange(data);
                },
            })}
            options={options}
            renderInput={({ inputProps, ...rest }) => (
                <TextField
                    {...(label && {
                        label: FieldLabel({
                            label: label,
                            optional:
                                !isFieldRequired(
                                    name,
                                    validationSchema,
                                    getValues()
                                ) &&
                                !props?.disabled &&
                                !removeOptional,
                        }),
                    })}
                    inputRef={ref}
                    inputProps={{ ...inputProps, readOnly: readOnly }}
                    {...genHelperPreviousValue(previousValue)}
                    {...genHelperError(error?.message)}
                    {...formProps}
                    {...rest}
                />
            )}
            {...props}
        />
    );
};

AutocompleteInput.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    options: PropTypes.array.isRequired,
    outputTransform: PropTypes.func,
    inputTransform: PropTypes.func,
    readOnly: PropTypes.bool,
    previousValue: PropTypes.any,
    allowNewValue: PropTypes.bool,
    onChangeCallback: PropTypes.func,
    formProps: PropTypes.object,
};

export default AutocompleteInput;

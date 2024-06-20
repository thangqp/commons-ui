/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ReactElement } from 'react';
import {
    IconButton,
    InputAdornment,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { Clear as ClearIcon } from '@mui/icons-material';
import { useController } from 'react-hook-form';
import TextFieldWithAdornment, {
    TextFieldWithAdornmentProps,
} from './utils/text-field-with-adornment';
import FieldLabel from './utils/field-label';
import {
    genHelperError,
    genHelperPreviousValue,
    identity,
    isFieldRequired,
} from './utils/functions';
import useCustomFormContext from './provider/use-custom-form-context';

import { Input } from '../../../utils/types';

export interface TextInputProps {
    name: string;
    label?: string;
    labelValues?: any; // it's for values from https://formatjs.io/docs/react-intl/components/#formattedmessage
    id?: string;
    adornment?: {
        position: string;
        text: string;
    };
    customAdornment?: ReactElement | null;
    outputTransform?: (value: string) => Input | null;
    inputTransform?: (value: Input) => string;
    acceptValue?: (value: string) => boolean;
    previousValue?: Input;
    clearable?: boolean;
    formProps?: Omit<
        TextFieldWithAdornmentProps | TextFieldProps,
        'value' | 'onChange' | 'inputRef' | 'inputProps' | 'InputProps'
    >;
}

function TextInput({
    name,
    label,
    labelValues, // this prop is used to add a value to label. this value is displayed without being translated
    id,
    adornment,
    customAdornment,
    outputTransform = identity, // transform materialUi input value before sending it to react hook form, mostly used to deal with number fields
    inputTransform = identity, // transform react hook form value before sending it to materialUi input, mostly used to deal with number fields
    acceptValue = () => true, // used to check user entry before committing the input change, used mostly to prevent user from typing a character in number field
    previousValue,
    clearable,
    formProps,
}: Readonly<TextInputProps>) {
    const { validationSchema, getValues, removeOptional } =
        useCustomFormContext();
    const {
        field: { onChange, value, ref },
        fieldState: { error },
    } = useController({ name });

    const Field = adornment ? TextFieldWithAdornment : TextField;
    const finalAdornment = {
        adornmentPosition: adornment?.position ?? '',
        adornmentText: adornment?.text ?? '',
    };

    const handleClearValue = () => {
        onChange(outputTransform(''));
    };

    const handleValueChanged = (e: any) => {
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
            key={id || label}
            size="small"
            fullWidth
            id={id || label}
            label={fieldLabel}
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
                    handleClearValue,
                })}
            {...genHelperPreviousValue(previousValue!, adornment)}
            {...genHelperError(error?.message)}
            {...formProps}
            {...finalAdornment}
        />
    );
}

export default TextInput;

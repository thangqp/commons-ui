/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import type { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { Autocomplete, TextField } from '@mui/material';
import { AutocompleteProps } from '@mui/material/Autocomplete/Autocomplete';
import FieldLabel from '../react-hook-form/utils/field-label';

type Option = { id: string; label?: string };

interface SelectClearableProps
    extends Omit<
        AutocompleteProps<Option, false, false, false>,
        'value' | 'onChange' | 'renderInput'
    > {
    value: string | null;
    onChange: (value: string | null) => void;
    label?: string;
}

const SelectClearable: FunctionComponent<SelectClearableProps> = (props) => {
    const { value, onChange, label, ...otherProps } = props;

    const intl = useIntl();

    const inputTransform = (value: string | null) => {
        return (
            (value && props.options.find((option) => option.id === value)) ||
            null
        );
    };

    const outputTransform = (option: Option | null) => {
        return option?.id ?? null;
    };

    return (
        <Autocomplete
            value={inputTransform(value)}
            onChange={(_, newValue) => onChange(outputTransform(newValue))}
            getOptionLabel={(option) => {
                return option.label
                    ? intl.formatMessage({ id: option.label }) // If the option has a label property, display the label using internationalization
                    : option.id; // If the option doesn't have a label property, display the ID instead
            }}
            renderInput={({ inputProps, ...otherParams }) => (
                <TextField
                    {...otherParams}
                    {...(label && {
                        label: FieldLabel({
                            label: label,
                        }),
                    })}
                    inputProps={{ ...inputProps, readOnly: true }}
                />
            )}
            {...otherProps}
        />
    );
};

export default SelectClearable;

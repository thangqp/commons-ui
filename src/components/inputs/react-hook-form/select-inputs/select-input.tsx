/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import AutocompleteInput, {
    AutocompleteInputProps,
} from '../autocomplete-inputs/autocomplete-input';
import { useIntl } from 'react-intl';
import { FunctionComponent } from 'react';
import { Option } from '../../../../utils/types';

export interface SelectInputProps
    extends Omit<
        AutocompleteInputProps,
        'outputTransform' | 'inputTransform' | 'readOnly' | 'getOptionLabel' // already defined in SelectInput
    > {
    options: Option[];
}

const SelectInput: FunctionComponent<SelectInputProps> = (props) => {
    const intl = useIntl();

    const inputTransform = (value: Option | null) => {
        if (value === null) {
            return null;
        }
        if (typeof value === 'string') {
            return (
                props.options.find(
                    (option) =>
                        typeof option !== 'string' && option?.id === value
                ) || null
            );
        }
        return (
            props.options.find(
                (option) =>
                    typeof option !== 'string' && option?.id === value.id
            ) || null
        );
    };

    const outputTransform = (value: Option | null) => {
        if (typeof value === 'string') {
            return value;
        }
        return value?.id ?? null;
    };

    return (
        <AutocompleteInput
            getOptionLabel={(option: Option) => {
                return typeof option !== 'string'
                    ? option?.label
                        ? intl.formatMessage({ id: option?.label }) // If the option has a label property, display the label using internationalization
                        : option?.id // If the option doesn't have a label property, display the ID instead
                    : option;
            }}
            inputTransform={inputTransform}
            outputTransform={outputTransform}
            readOnly={true}
            {...props}
        />
    );
};

export default SelectInput;

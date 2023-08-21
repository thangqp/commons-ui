/**
 * Copyright (c) 2022, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import AutocompleteInput from './autocomplete-input';
import { useIntl } from 'react-intl';

const SelectInput = (props) => {
    const intl = useIntl();

    const inputTransform = (value) =>
        props.options.find((option) => option?.id === value) || null;

    const outputTransform = (value) => {
        return value?.id ?? null;
    };

    return (
        <AutocompleteInput
            getOptionLabel={(option) => {
                return option?.label
                    ? intl.formatMessage({ id: option?.label }) // If the option has a label property, display the label using internationalization
                    : option?.id; // If the option doesn't have a label property, display the ID instead
            }}
            inputTransform={inputTransform}
            outputTransform={outputTransform}
            readOnly={true}
            {...props}
        />
    );
};

SelectInput.propTypes = {
    options: PropTypes.array.isRequired,
    ...AutocompleteInput.propTypes,
};

export default SelectInput;

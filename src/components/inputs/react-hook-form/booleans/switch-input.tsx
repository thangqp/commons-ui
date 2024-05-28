/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BooleanInput from './boolean-input';
import { Switch, SwitchProps } from '@mui/material';

export interface SwitchInputProps {
    name: string;
    label: string;
    formProps: SwitchProps;
}

const SwitchInput = ({ name, label, formProps }: SwitchInputProps) => {
    return (
        <BooleanInput
            name={name}
            label={label}
            formProps={formProps}
            Input={Switch}
        />
    );
};

export default SwitchInput;

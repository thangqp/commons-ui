/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import BooleanInput from './boolean-input';
import { Checkbox, CheckboxProps } from '@mui/material';

export interface CheckboxInputProps {
    name: string;
    label: string;
    formProps: CheckboxProps;
}

const CheckboxInput = ({ name, label, formProps }: CheckboxInputProps) => {
    return (
        <BooleanInput
            name={name}
            label={label}
            formProps={formProps}
            Input={Checkbox}
        />
    );
};

export default CheckboxInput;

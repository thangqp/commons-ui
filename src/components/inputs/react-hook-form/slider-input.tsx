/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Slider, SliderProps } from '@mui/material';
import { useController } from 'react-hook-form';
import { identity } from './utils/functions';

export interface SliderInputProps extends SliderProps {
    name: string;
    onValueChanged: (value: any) => void;
}

const SliderInput = ({
    name,
    min,
    max,
    step,
    size = 'small',
    onValueChanged = identity,
}: SliderInputProps) => {
    const {
        field: { onChange, value },
    } = useController({ name });

    const handleValueChange = (
        event: Event,
        value: number | number[],
        activeThumb: number
    ) => {
        onValueChanged(value);
        onChange(value);
    };

    return (
        <Slider
            size={size}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleValueChange}
        />
    );
};

export default SliderInput;

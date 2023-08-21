/**
 * Copyright (c) 2023, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Slider } from '@mui/material';
import { useController } from 'react-hook-form';
import { identity } from './utils/functions';

const SliderInput = ({
    name,
    min,
    max,
    step,
    size = 'small',
    onValueChange = identity,
}) => {
    const {
        field: { onChange, value },
    } = useController({ name });

    const handleValueChange = (e) => {
        onChange(onValueChange(e.target.value));
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

SliderInput.propTypes = {
    name: PropTypes.string.isRequired,
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    step: PropTypes.number.isRequired,
    size: PropTypes.string,
    onValueChange: PropTypes.func,
};

export default SliderInput;

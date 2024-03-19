/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from 'react';
import { InputAdornment } from '@mui/material';
import { FunctionComponent } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { TextInput } from '../..';

interface ExpandingTextFieldProps {
    name: string;
    maxCharactersNumber?: number;
    rows?: number;
    minRows?: number;
    sx?: any;
    label?: string;
    textFieldFormProps?: any;
    otherTexFieldProps?: any;
}
const ExpandingTextField: FunctionComponent<ExpandingTextFieldProps> = ({
    name,
    maxCharactersNumber,
    rows,
    minRows = 1,
    sx,
    label,
    textFieldFormProps,
    otherTexFieldProps,
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { control } = useFormContext();
    const descriptionWatch = useWatch({
        name: name,
        control,
    });
    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const maxCounter = maxCharactersNumber ?? 500;
    const isOverTheLimit = descriptionWatch?.length > maxCounter;
    const descriptionLength = descriptionWatch?.length ?? 0;
    const descriptionCounter = descriptionLength + '/' + maxCounter;

    const rowsToDisplay = isFocused ? rows : minRows;

    const formProps = {
        size: 'medium',
        multiline: true,
        onFocus: handleFocus,
        onBlur: handleBlur,
        InputProps: {
            endAdornment: (
                <InputAdornment
                    color={'red'}
                    position="end"
                    sx={{
                        position: 'absolute',
                        bottom: 10,
                        right: 8,
                    }}
                >
                    <div
                        style={{
                            color: isOverTheLimit ? 'red' : 'inherit',
                        }}
                    >
                        {descriptionCounter}
                    </div>
                </InputAdornment>
            ),
            style: {
                textOverflow: 'ellipsis',
                overflow: 'hidden', // disable scrolling
                whiteSpace: 'pre',
                resize: 'none', // or 'horizontal' for horizontal resizing
            },
        },
        ...(rowsToDisplay && { rows: rowsToDisplay }),
        ...(sx && { sx: sx }),
        ...textFieldFormProps,
    };
    return (
        <TextInput
            name={name}
            label={label}
            formProps={formProps}
            {...otherTexFieldProps}
        />
    );
};

export default ExpandingTextField;

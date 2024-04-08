/**
 * Copyright (c) 2024, RTE (http://www.rte-france.com)
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { FunctionComponent, useState } from 'react';
import { TextFieldProps, Theme, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import { TextInput, TextInputProps } from '../..';
import { useCustomFormContext } from './provider/use-custom-form-context';

interface ExpandingTextFieldProps extends TextInputProps {
    name: string;
    maxCharactersNumber?: number;
    rows?: number;
    minRows?: number;
    sx?: any;
    label?: string;
    textFieldFormProps?: TextFieldProps;
}

const ExpandingTextField: FunctionComponent<ExpandingTextFieldProps> = ({
    name,
    maxCharactersNumber = 500,
    rows,
    minRows = 1,
    sx,
    label,
    textFieldFormProps,
    ...otherTexFieldProps
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const { control } = useCustomFormContext();
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
    const isOverTheLimit = descriptionWatch?.length > maxCharactersNumber;
    const descriptionLength = descriptionWatch?.length ?? 0;
    const descriptionCounter = descriptionLength + '/' + maxCharactersNumber;

    const rowsToDisplay = isFocused ? rows : minRows;

    const formProps = {
        size: 'medium',
        multiline: true,
        onFocus: handleFocus,
        onBlur: handleBlur,
        InputProps: {
            style: {
                textOverflow: 'ellipsis',
                overflow: 'hidden', // disable scrolling
                whiteSpace: 'pre',
                resize: 'none', // or 'horizontal' for horizontal resizing
            },
        },
        helperText: (
            <Typography variant="caption">{descriptionCounter}</Typography>
        ),
        FormHelperTextProps: {
            sx: {
                ml: 'auto',
                color: (theme: Theme) =>
                    isOverTheLimit
                        ? theme.palette.error.main
                        : theme.palette.text.secondary,
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
